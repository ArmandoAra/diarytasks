import { DbResult, runQuery, runWrite } from './client';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';

/** Columns selected for every note read, kept in one place. */
const NOTE_COLUMNS = 'id, title, message, isFavorite, date';

const NOT_FOUND = 'No note found with the specified ID';

export async function createNote(note: CreateNoteProps): Promise<DbResult<string>> {
    const result = await runQuery('create note', (db) =>
        db.runAsync(
            'INSERT INTO Note (title, message, isFavorite, date) VALUES (?, ?, ?, ?)',
            [note.title, note.message, note.isFavorite, note.date],
        ),
    );

    if (!result.success) {
        return { success: false, message: result.message, error: result.error };
    }

    if (!result.data?.changes) {
        return { success: false, message: 'Error inserting note' };
    }

    return {
        success: true,
        data: String(result.data.lastInsertRowId),
        message: 'Note created successfully',
    };
}

export async function updateNoteById(id: string, data: CreateNoteProps): Promise<DbResult> {
    return runWrite(
        'update note',
        (db) => db.runAsync(
            `UPDATE Note SET
                 title = ?,
                 message = ?,
                 isFavorite = ?,
                 date = ?,
                 updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [data.title, data.message, data.isFavorite, data.date, id],
        ),
        { success: 'Note updated successfully', notFound: NOT_FOUND },
    );
}

export async function updateFavorite(id: string, isFavorite: number): Promise<DbResult> {
    return runWrite(
        'update note favorite',
        (db) => db.runAsync(
            'UPDATE Note SET isFavorite = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [isFavorite, id],
        ),
        { success: 'Note updated successfully', notFound: NOT_FOUND },
    );
}

export async function deleteNoteById(id: string): Promise<DbResult> {
    return runWrite(
        'delete note',
        (db) => db.runAsync('DELETE FROM Note WHERE id = ?', [id]),
        { success: 'Note deleted successfully', notFound: NOT_FOUND },
    );
}

export async function getNotesByDate(date: string): Promise<DbResult<CreateNoteProps[]>> {
    return runQuery('get notes by date', (db) =>
        db.getAllAsync<CreateNoteProps>(
            `SELECT ${NOTE_COLUMNS} FROM Note WHERE date = ? ORDER BY id`,
            [date],
        ),
    );
}

export async function getFavoritesNotes(): Promise<DbResult<CreateNoteProps[]>> {
    return runQuery('get favorite notes', (db) =>
        db.getAllAsync<CreateNoteProps>(
            `SELECT ${NOTE_COLUMNS} FROM Note WHERE isFavorite = 1 ORDER BY id DESC`,
        ),
    );
}
