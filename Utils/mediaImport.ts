import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';

import { NewNoteMedia } from '@/db/mediaDb';
import { deleteMediaFile, persistMedia } from './mediaStorage';

/**
 * Longest edge of a generated thumbnail, in px.
 *
 * Note cards and the calendar render thumbnails, never the original: decoding a
 * 12MP photo into a small card wastes memory and scroll frames.
 */
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 0.6;

export type PickSource = 'library' | 'camera';

/** Asks for the permission a source needs. */
async function ensurePermission(source: PickSource): Promise<boolean> {
    const { granted } =
        source === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

    return granted;
}

async function makeImageThumbnail(uri: string): Promise<string | null> {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: THUMBNAIL_SIZE } }],
            { compress: THUMBNAIL_QUALITY, format: ImageManipulator.SaveFormat.JPEG },
        );

        return await persistMedia(result.uri, 'image');
    } catch (error) {
        console.warn('[media] could not build image thumbnail:', error);
        return null;
    }
}

async function makeVideoThumbnail(uri: string): Promise<string | null> {
    try {
        // A frame one second in; frame 0 is often black.
        const { uri: frame } = await VideoThumbnails.getThumbnailAsync(uri, { time: 1000 });
        const resized = await ImageManipulator.manipulateAsync(
            frame,
            [{ resize: { width: THUMBNAIL_SIZE } }],
            { compress: THUMBNAIL_QUALITY, format: ImageManipulator.SaveFormat.JPEG },
        );

        return await persistMedia(resized.uri, 'image');
    } catch (error) {
        console.warn('[media] could not build video thumbnail:', error);
        return null;
    }
}

export interface PickResult {
    /** Attachments ready to insert, minus the noteId the caller supplies. */
    media: Omit<NewNoteMedia, 'noteId'>[];
    /** Set when the user denied the permission, so the UI can explain why. */
    permissionDenied?: boolean;
}

/**
 * Opens the picker or the camera and turns the selection into storable
 * attachments: each file is copied out of the picker's cache into permanent
 * storage and given a thumbnail.
 */
export async function pickMedia(
    source: PickSource,
    { allowsMultipleSelection = true }: { allowsMultipleSelection?: boolean } = {},
): Promise<PickResult> {
    if (!(await ensurePermission(source))) {
        return { media: [], permissionDenied: true };
    }

    const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images', 'videos'],
        quality: 1,
        // The camera returns a single capture, so multi-select is library-only.
        allowsMultipleSelection: source === 'library' && allowsMultipleSelection,
    };

    const result =
        source === 'camera'
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) return { media: [] };

    const media = await Promise.all(result.assets.map(toStoredMedia));

    return { media: media.filter((item): item is Omit<NewNoteMedia, 'noteId'> => item !== null) };
}

async function toStoredMedia(
    asset: ImagePicker.ImagePickerAsset,
): Promise<Omit<NewNoteMedia, 'noteId'> | null> {
    const kind: 'image' | 'video' = asset.type === 'video' ? 'video' : 'image';
    let path: string | null = null;

    try {
        // Copy first: the picker's URI lives in the cache and can be purged.
        path = await persistMedia(asset.uri, kind);

        const thumbPath =
            kind === 'video'
                ? await makeVideoThumbnail(asset.uri)
                : await makeImageThumbnail(asset.uri);

        return {
            kind,
            path,
            thumbPath,
            width: asset.width ?? null,
            height: asset.height ?? null,
            durationMs: asset.duration ?? null,
        };
    } catch (error) {
        console.error('[media] could not import asset:', error);
        // Do not leave a copied file behind with no row pointing at it.
        await deleteMediaFile(path);
        return null;
    }
}
