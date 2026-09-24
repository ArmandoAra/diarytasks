import { DbResult, runQuery, runWrite } from './client';
import { deleteMediaFile } from '@/Utils/mediaStorage';

export type MediaKind = 'image' | 'video';

export interface NoteMedia {
    id: string;
    noteId: string;
    kind: MediaKind;
    /** Relative to documentDirectory - resolve with `toAbsoluteUri`. */
    path: string;
    thumbPath: string | null;
    width: number | null;
    height: number | null;
    durationMs: number | null;
    orderIndex: number;
}

export type NewNoteMedia = Omit<NoteMedia, 'id' | 'orderIndex'> & { orderIndex?: number };

const MEDIA_COLUMNS = 'id, noteId, kind, path, thumbPath, width, height, durationMs, orderIndex';

export async function getMediaForNote(noteId: string): Promise<DbResult<NoteMedia[]>> {
    return runQuery('get media for note', (db) =>
        db.getAllAsync<NoteMedia>(
            `SELECT ${MEDIA_COLUMNS} FROM NoteMedia WHERE noteId = ? ORDER BY orderIndex, id`,
            [noteId],
        ),
    );
}

/** Attachments for several notes at once, so a list does not query per row. */
export async function getMediaForNotes(
    noteIds: string[],
): Promise<DbResult<Record<string, NoteMedia[]>>> {
    if (noteIds.length === 0) return { success: true, data: {} };

    const placeholders = noteIds.map(() => '?').join(', ');
    const result = await runQuery('get media for notes', (db) =>
        db.getAllAsync<NoteMedia>(
            `SELECT ${MEDIA_COLUMNS} FROM NoteMedia
              WHERE noteId IN (${placeholders})
              ORDER BY noteId, orderIndex, id`,
            noteIds,
        ),
    );

    if (!result.success || !result.data) return { ...result, data: {} };

    const grouped: Record<string, NoteMedia[]> = {};
    for (const media of result.data) {
        (grouped[String(media.noteId)] ??= []).push(media);
    }

    return { success: true, data: grouped };
}

export async function addMedia(media: NewNoteMedia): Promise<DbResult> {
    return runWrite(
        'add media',
        async (db) => {
            // Append after whatever is already attached to the note.
            const last = await db.getFirstAsync<{ next: number }>(
                'SELECT COALESCE(MAX(orderIndex), -1) + 1 AS next FROM NoteMedia WHERE noteId = ?',
                [media.noteId],
            );

            return db.runAsync(
                `INSERT INTO NoteMedia (noteId, kind, path, thumbPath, width, height, durationMs, orderIndex)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    media.noteId,
                    media.kind,
                    media.path,
                    media.thumbPath,
                    media.width,
                    media.height,
                    media.durationMs,
                    media.orderIndex ?? last?.next ?? 0,
                ],
            );
        },
        { success: 'Media added', notFound: 'Error inserting media' },
    );
}

/**
 * Removes one attachment, deleting its files first.
 *
 * The files go before the row: if the delete fails midway a row pointing at a
 * missing file renders as a broken thumbnail, whereas a file with no row is
 * invisible and leaks storage forever.
 */
export async function deleteMedia(id: string): Promise<DbResult> {
    const existing = await runQuery('find media', (db) =>
        db.getFirstAsync<{ path: string; thumbPath: string | null }>(
            'SELECT path, thumbPath FROM NoteMedia WHERE id = ?',
            [id],
        ),
    );

    if (existing.success && existing.data) {
        await deleteMediaFile(existing.data.path);
        await deleteMediaFile(existing.data.thumbPath);
    }

    return runWrite(
        'delete media',
        (db) => db.runAsync('DELETE FROM NoteMedia WHERE id = ?', [id]),
        { success: 'Media deleted', notFound: 'No media found with the specified ID' },
    );
}

/**
 * Deletes every attachment of a note, files included.
 *
 * Call this *before* deleting the note: the table's ON DELETE CASCADE drops
 * the rows but leaves the files on disk, which is how these apps quietly grow
 * to gigabytes.
 */
export async function deleteMediaForNote(noteId: string): Promise<DbResult> {
    const existing = await getMediaForNote(noteId);

    for (const media of existing.data ?? []) {
        await deleteMediaFile(media.path);
        await deleteMediaFile(media.thumbPath);
    }

    const result = await runQuery('delete media for note', (db) =>
        db.runAsync('DELETE FROM NoteMedia WHERE noteId = ?', [noteId]),
    );

    // A note with no attachments is a normal case, so zero rows is still success.
    return { success: result.success, message: result.message, error: result.error };
}

/** Every attachment, newest first - for a media-only gallery. */
export async function getAllMedia(limit = 200, offset = 0): Promise<DbResult<NoteMedia[]>> {
    return runQuery('get all media', (db) =>
        db.getAllAsync<NoteMedia>(
            `SELECT ${MEDIA_COLUMNS} FROM NoteMedia ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset],
        ),
    );
}

/** An attachment plus the date of the note it belongs to. */
export interface DatedMedia extends NoteMedia {
    date: string;
}

/**
 * One cover thumbnail per day, for the calendar.
 *
 * MIN(m.id) picks the first attachment of the day deterministically, so the
 * calendar does not change cover between renders.
 */
export async function getDayCovers(): Promise<DbResult<Record<string, string>>> {
    const result = await runQuery('get day covers', (db) =>
        db.getAllAsync<{ date: string; thumbPath: string | null; path: string }>(
            `SELECT n.date AS date, m.thumbPath AS thumbPath, m.path AS path
               FROM NoteMedia m
               JOIN Note n ON n.id = m.noteId
              WHERE m.id IN (
                    SELECT MIN(m2.id) FROM NoteMedia m2
                      JOIN Note n2 ON n2.id = m2.noteId
                     WHERE n2.date IS NOT NULL AND n2.date <> ''
                     GROUP BY n2.date
              )`,
        ),
    );

    if (!result.success || !result.data) return { ...result, data: {} };

    const covers: Record<string, string> = {};
    for (const row of result.data) {
        covers[row.date] = row.thumbPath ?? row.path;
    }

    return { success: true, data: covers };
}

/** Every attachment with its note's date, newest first - the gallery grid. */
export async function getGalleryMedia(limit = 300, offset = 0): Promise<DbResult<DatedMedia[]>> {
    return runQuery('get gallery media', (db) =>
        db.getAllAsync<DatedMedia>(
            `SELECT m.id, m.noteId, m.kind, m.path, m.thumbPath, m.width, m.height,
                    m.durationMs, m.orderIndex, n.date AS date
               FROM NoteMedia m
               JOIN Note n ON n.id = m.noteId
              ORDER BY n.date DESC, m.id DESC
              LIMIT ? OFFSET ?`,
            [limit, offset],
        ),
    );
}

/** Attachments of favourite notes only. */
export async function getFavouriteMedia(): Promise<DbResult<DatedMedia[]>> {
    return runQuery('get favourite media', (db) =>
        db.getAllAsync<DatedMedia>(
            `SELECT m.id, m.noteId, m.kind, m.path, m.thumbPath, m.width, m.height,
                    m.durationMs, m.orderIndex, n.date AS date
               FROM NoteMedia m
               JOIN Note n ON n.id = m.noteId
              WHERE n.isFavorite = 1
              ORDER BY n.date DESC, m.id DESC`,
        ),
    );
}

export interface Memory {
    date: string;
    yearsAgo: number;
    noteCount: number;
    cover: string | null;
}

/**
 * Entries from the same day in previous years.
 *
 * This is only expressible in SQL because dates are ISO: strftime can pull the
 * month and day out of the stored string.
 */
export async function getOnThisDay(today: string): Promise<DbResult<Memory[]>> {
    const result = await runQuery('get memories', (db) =>
        db.getAllAsync<{ date: string; noteCount: number; cover: string | null }>(
            `SELECT n.date AS date,
                    COUNT(DISTINCT n.id) AS noteCount,
                    MIN(COALESCE(m.thumbPath, m.path)) AS cover
               FROM Note n
               LEFT JOIN NoteMedia m ON m.noteId = n.id
              WHERE strftime('%m-%d', n.date) = strftime('%m-%d', ?)
                AND n.date < ?
              GROUP BY n.date
              ORDER BY n.date DESC`,
            [today, today],
        ),
    );

    if (!result.success || !result.data) return { ...result, data: [] };

    const thisYear = Number(today.slice(0, 4));
    return {
        success: true,
        data: result.data.map((row) => ({
            ...row,
            yearsAgo: thisYear - Number(row.date.slice(0, 4)),
        })),
    };
}
