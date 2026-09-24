import { DbResult, runQuery } from './client';
import { CreateTaskProps, Status, ImportanceLevel } from '@/interfaces/TasksInterfaces';
import { getMediaForNotes, NoteMedia } from './mediaDb';

/**
 * A day's tasks and notes merged into one chronological list.
 *
 * Ordering uses `createdAt`, which both tables already had. SQLite writes it as
 * UTC via CURRENT_TIMESTAMP, so the displayed time is converted with SQLite's
 * own 'localtime' modifier rather than being shown as UTC.
 */
export interface TimelineTask extends CreateTaskProps {
    kind: 'task';
    time: string;
    sortKey: string;
}

export interface TimelineNote {
    kind: 'note';
    id: string;
    title: string;
    message: string;
    isFavorite: number;
    date: string;
    time: string;
    sortKey: string;
    media: NoteMedia[];
}

export type TimelineEntry = TimelineTask | TimelineNote;

interface TaskRow {
    id: string; title: string; description: string;
    status: Status; priority: ImportanceLevel; date: string;
    time: string; sortKey: string;
}

interface NoteRow {
    id: string; title: string; message: string;
    isFavorite: number; date: string; time: string; sortKey: string;
}

export async function getDayEntries(date: string): Promise<DbResult<TimelineEntry[]>> {
    const tasks = await runQuery('get day tasks', (db) =>
        db.getAllAsync<TaskRow>(
            `SELECT id, title, description, status, priority, date,
                    strftime('%H:%M', createdAt, 'localtime') AS time,
                    COALESCE(createdAt, '') AS sortKey
               FROM Task WHERE date = ?`,
            [date],
        ),
    );

    const notes = await runQuery('get day notes', (db) =>
        db.getAllAsync<NoteRow>(
            `SELECT id, title, message, isFavorite, date,
                    strftime('%H:%M', createdAt, 'localtime') AS time,
                    COALESCE(createdAt, '') AS sortKey
               FROM Note WHERE date = ?`,
            [date],
        ),
    );

    if (!tasks.success || !notes.success) {
        return { success: false, message: 'Error loading the day', data: [] };
    }

    const noteRows = notes.data ?? [];
    const media = await getMediaForNotes(noteRows.map((note) => String(note.id)));
    const mediaByNote = media.data ?? {};

    const entries: TimelineEntry[] = [
        ...(tasks.data ?? []).map((task): TimelineTask => ({ ...task, kind: 'task' })),
        ...noteRows.map((note): TimelineNote => ({
            ...note,
            kind: 'note',
            media: mediaByNote[String(note.id)] ?? [],
        })),
    ];

    // createdAt is 'YYYY-MM-DD HH:MM:SS', so it sorts as a plain string. Rows
    // without one (older seed data) fall to the end rather than to the top.
    entries.sort((a, b) => (a.sortKey || '9999').localeCompare(b.sortKey || '9999'));

    return { success: true, data: entries };
}
