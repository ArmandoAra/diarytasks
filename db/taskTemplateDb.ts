import * as FileSystem from 'expo-file-system';

// Db
import * as SQLite from 'expo-sqlite';


// Interfaces
import { CreateTaskTemplateProps } from '@/interfaces/TasksInterfaces';


// createTaskByTemplateId()

export async function getAllTaskTemplates() {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar las tareas para una fecha específica
        const result = await db.runAsync(
            `SELECT * FROM TaskTemplate`,
        );

        // Verificar si se encontraron tareas
        if (result.changes > 0) {
            console.log('Tasks retrieved successfully');
            return { success: true, tasks: result };
        } else {
            console.log('No tasks found for the specified date');
            return { success: false, message: 'No tasks found for the specified date' };
        }
    } catch (error) {
        console.log('Error retrieving tasks:', error);
        return { success: false, message: 'Error retrieving tasks', error };
    }
}

export async function createTaskTemplate(data: CreateTaskTemplateProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const newTask = {
        title: data.title,
        description: data.description,
    }

    try {
        await db.runAsync(
            'INSERT INTO TaskTemplate (title, description) VALUES (?, ?)',
            [newTask.title, newTask.description]
        );

    } catch (error) {
        console.log('Error inserting Template', error)
        console.log(error)
    }
}

export async function updateTaskById(id: string, data: CreateTaskTemplateProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const updatedTask = {
        title: data.title,
        description: data.description,
    };

    // Obtener la fecha actual para el campo updatedAt
    const updatedAt = new Date().toISOString();

    try {
        // Actualizar la tarea en la base de datos
        const result = await db.runAsync(
            `UPDATE Task
             SET title = ?, 
             description = ?, 
             updatedAt = ?
             WHERE id = ?`,
            [
                updatedTask.title,
                updatedTask.description,
                updatedAt,
                id,
            ]
        );

        // Verificar si la tarea fue actualizada
        if (result.changes > 0) {
            console.log('Template updated successfully');
            return { success: true, message: 'Template updated successfully' };
        } else {
            console.log('No Template found with the specified ID');
            return { success: false, message: 'No Template found with the specified ID' };
        }
    } catch (error) {
        console.log('Error updating Template:', error);
        return { success: false, message: 'Error updating Template', error };
    }
}

export async function deleteTaskTemplateById(id: string) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Eliminar la tarea con el ID especificado
        const result = await db.runAsync(
            `DELETE FROM TaskTemplate WHERE id = ?`,
            [id]
        );

        // Verificar si se eliminó alguna fila
        if (result.changes > 0) {
            console.log('Template deleted successfully');
            return { success: true, message: 'Template deleted successfully' };
        } else {
            console.log('No Template found with the specified ID');
            return { success: false, message: 'No Template found with the specified ID' };
        }
    } catch (error) {
        console.log('Error deleting Template:', error);
        return { success: false, message: 'Error deleting Template', error };
    }
}