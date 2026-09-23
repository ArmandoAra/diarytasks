import * as FileSystem from 'expo-file-system';

/**
 * Where attachments live on disk, and how they are referenced.
 *
 * Two rules drive everything here:
 *
 * 1. The URI returned by the image picker points into the app's *cache*, which
 *    the OS is free to purge. Anything the user keeps has to be copied into
 *    `documentDirectory` first, or the attachment disappears later.
 * 2. Only the path *relative* to `documentDirectory` is stored in SQLite. On
 *    iOS the app container is a UUID that changes when the app is reinstalled
 *    or updated, so an absolute `file:///var/mobile/...` URI goes stale. The
 *    absolute path is rebuilt at read time by `toAbsoluteUri`.
 */
export const MEDIA_DIRECTORY = 'media';

/** Rebuilds a usable `file://` URI from a stored relative path. */
export function toAbsoluteUri(relativePath: string): string {
    return `${FileSystem.documentDirectory}${relativePath}`;
}

/** Creates the media directory if it is not there yet. */
async function ensureMediaDirectory(): Promise<void> {
    const dir = toAbsoluteUri(MEDIA_DIRECTORY);
    const info = await FileSystem.getInfoAsync(dir);

    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
}

function extensionOf(uri: string, fallback: string): string {
    // Strip any query string before looking for the extension.
    const clean = uri.split('?')[0];
    const match = /\.([A-Za-z0-9]+)$/.exec(clean);
    return match ? match[1].toLowerCase() : fallback;
}

/** Collision-proof file name: timestamp plus a short random suffix. */
function uniqueName(extension: string): string {
    const random = Math.random().toString(36).slice(2, 8);
    return `${Date.now()}-${random}.${extension}`;
}

/**
 * Copies a picked file into permanent storage.
 *
 * @returns the path relative to `documentDirectory`, ready to store in SQLite.
 */
export async function persistMedia(
    sourceUri: string,
    kind: 'image' | 'video',
): Promise<string> {
    await ensureMediaDirectory();

    const extension = extensionOf(sourceUri, kind === 'video' ? 'mp4' : 'jpg');
    const relativePath = `${MEDIA_DIRECTORY}/${uniqueName(extension)}`;

    await FileSystem.copyAsync({ from: sourceUri, to: toAbsoluteUri(relativePath) });

    return relativePath;
}

/**
 * Deletes a stored file. Missing files are not an error - the row may outlive
 * the file if storage was cleared.
 */
export async function deleteMediaFile(relativePath: string | null | undefined): Promise<void> {
    if (!relativePath) return;

    try {
        await FileSystem.deleteAsync(toAbsoluteUri(relativePath), { idempotent: true });
    } catch (error) {
        console.warn('[media] could not delete file:', relativePath, error);
    }
}

/** Total bytes used by attachments, for a "storage used" line in settings. */
export async function getMediaSize(): Promise<number> {
    const dir = toAbsoluteUri(MEDIA_DIRECTORY);
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) return 0;

    const names = await FileSystem.readDirectoryAsync(dir);
    const sizes = await Promise.all(
        names.map(async (name) => {
            const file = await FileSystem.getInfoAsync(`${dir}/${name}`);
            return file.exists && !file.isDirectory ? file.size : 0;
        }),
    );

    return sizes.reduce((total, size) => total + size, 0);
}
