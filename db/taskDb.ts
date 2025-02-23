
// Db
import * as SQLite from 'expo-sqlite';

// Interfaces
import { CreateTaskProps, Status } from '@/interfaces/TasksInterfaces';

export async function createTask(data: CreateTaskProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const newTask = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        date: data.date,
    }

    try {
        await db.runAsync(
            'INSERT INTO Task (title, description, priority, status, date) VALUES (?, ?, ?, ?, ?)',
            [newTask.title, newTask.description, newTask.priority, newTask.status, newTask.date]
        );

    } catch (error) {
        console.log('Error inserting task', error)
        console.log(error)
    }
}

export async function updateTaskById(id: string, data: CreateTaskProps) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const updatedTask = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        date: data.date,
    };

    // Obtener la fecha actual para el campo modifiedAt
    const modifiedAt = new Date().toISOString();

    try {
        // Actualizar la tarea en la base de datos
        const result = await db.runAsync(
            `UPDATE Task SET
                 title = ?, 
                 description = ?, 
                 priority = ?, 
                 status = ?, 
                 date = ?
             WHERE id = ?`,
            [
                updatedTask.title,
                updatedTask.description,
                updatedTask.priority,
                updatedTask.status,
                updatedTask.date,
                id
            ]
        );

        // Verificar si la tarea fue actualizada
        if (result.changes > 0) {
            console.log('Task updated successfully');
            return { success: true, message: 'Task updated successfully' };
        } else {
            console.log('No task found with the specified ID');
            return { success: false, message: 'No task found with the specified ID' };
        }
    } catch (error) {
        console.log('Error updating task:', error);
        return { success: false, message: 'Error updating task', error };
    }
}

export async function getTasksByDate(date: string): Promise<{ success: boolean; data?: CreateTaskProps[]; message?: string; error?: any }> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar las tareas para una fecha específica
        const result = await db.getAllAsync(
            `SELECT * FROM Task WHERE date = ?`,
            [date]
        );

        // Verificar si se encontraron tareas
        if (result && Array.isArray(result)) {
            console.log('Tasks retrieved successfully');
            return { success: true, data: result as CreateTaskProps[] };
        } else {
            console.log('No tasks found for the specified date');
            return { success: false, message: 'No tasks found for the specified date' };
        }
    } catch (error) {
        console.log('Error retrieving tasks:', error);
        return { success: false, message: 'Error retrieving tasks', error };
    }
}

export async function deleteTaskById(id: string): Promise<{ success: boolean; data?: CreateTaskProps[]; message?: string; error?: any }> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Eliminar la tarea con el ID especificado
        const result = await db.runAsync(
            `DELETE FROM Task WHERE id = ?`,
            [id]
        );

        // Verificar si se eliminó alguna fila
        if (result.changes > 0) {
            console.log('Task deleted successfully');
            return { success: true, message: 'Task deleted successfully' };
        } else {
            console.log('No task found with the specified ID');
            return { success: false, message: 'No task found with the specified ID' };
        }
    } catch (error) {
        console.log('Error deleting task:', error);
        return { success: false, message: 'Error deleting task', error };
    }
}

export async function getAllTasks(): Promise<{ success: boolean; data?: CreateTaskProps[]; message?: string; error?: any }> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar todas las tareas
        const result = await db.getAllAsync(`SELECT * FROM Task`);

        if (result && Array.isArray(result)) {
            return { success: true, data: result as CreateTaskProps[] };
        } else {
            console.error('No tasks found or invalid format:', result);
            return { success: false, message: 'No tasks found or invalid format' };
        }
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return { success: false, message: 'Error retrieving tasks', error };
    }
}

export async function updateTaskStatus(id: string, status: Status) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    const newStatus: Status = (status == "Completed") ? "ToDo" : "Completed";

    try {
        // Actualizar la tarea en la base de datos
        const result = await db.runAsync(
            `UPDATE Task SET
                 status = ? 
             WHERE id = ?`,
            [
                newStatus,
                id
            ]
        );

        // Verificar si la tarea fue actualizada
        if (result.changes > 0) {
            console.log('Status updated successfully');
            return { success: true, message: 'Status updated successfully' };
        } else {
            console.log('No task found with the specified ID');
            return { success: false, message: 'No task found with the specified ID' };
        }
    } catch (error) {
        console.log('Error updating task:', error);
        return { success: false, message: 'Error updating task', error };
    }
}
