import * as FileSystem from 'expo-file-system';

// Db
import * as SQLite from 'expo-sqlite';


// Interfaces
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';


// createTaskByTemplateId()


export async function createNote(data: CreateNoteProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const newNote = {
        title: data.title,
        message: data.message,
        isFavorite: data.isFavorite,
        date: data.date,
    }
    // INSERT INTO Note (title, message, isFavorite, date) VALUES ('Nueva Nota', 'Hola a todos', 0, '21/3/2025');
    try {
        await db.runAsync(
            'INSERT INTO Note (title, message, isFavorite, date) VALUES (?, ?, ?, ?)',
            [newNote.title, newNote.message, newNote.isFavorite, newNote.date]
        );

    } catch (error) {
        console.log('Error inserting Note', error)
        console.log(error)
    }
}

export async function updateNoteById(id: string, data: CreateNoteProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const updatedNote = {
        title: data.title,
        message: data.message,
        isFavorite: data.isFavorite,
        date: data.date,
    };

    // Obtener la fecha actual para el campo updatedAt
    const updatedAt = new Date().toISOString();

    try {
        // Actualizar la tarea en la base de datos
        const result = await db.runAsync(
            `UPDATE Note SET 
                 title = ?, 
                 message = ?, 
                 isFavorite = ?, 
                 dates = ?, 
                 updatedAt = ?
             WHERE id = ?`,
            [
                updatedNote.title,
                updatedNote.message,
                updatedNote.isFavorite,
                updatedNote.date,
                updatedAt,
                id,
            ]
        );

        // Verificar si la tarea fue actualizada
        if (result.changes > 0) {
            console.log('Note updated successfully');
            return { success: true, message: 'Note updated successfully' };
        } else {
            console.log('No Note found with the specified ID');
            return { success: false, message: 'No Note found with the specified ID' };
        }
    } catch (error) {
        console.log('Error updating Note:', error);
        return { success: false, message: 'Error updating Note', error };
    }
}

export async function getNotesByDate(date: string) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar las tareas para una fecha específica
        const result = await db.runAsync(
            `SELECT * FROM Note WHERE date = ? ORDER BY createdAt ASC`,
            [date]
        );

        // Verificar si se encontraron tareas
        if (result.changes > 0) {
            console.log('Notes retrieved successfully');
            return { success: true, Notes: result };
        } else {
            console.log('No Notes found for the specified date');
            return { success: false, message: 'No Notes found for the specified date' };
        }
    } catch (error) {
        console.log('Error retrieving Notes:', error);
        return { success: false, message: 'Error retrieving Notes', error };
    }
}

export async function deleteNoteById(id: string) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Eliminar la tarea con el ID especificado
        const result = await db.runAsync(
            `DELETE FROM Note WHERE id = ?`,
            [id]
        );

        // Verificar si se eliminó alguna fila
        if (result.changes > 0) {
            console.log('Note deleted successfully');
            return { success: true, message: 'Note deleted successfully' };
        } else {
            console.log('No Note found with the specified ID');
            return { success: false, message: 'No Note found with the specified ID' };
        }
    } catch (error) {
        console.log('Error deleting Note:', error);
        return { success: false, message: 'Error deleting Note', error };
    }
}
