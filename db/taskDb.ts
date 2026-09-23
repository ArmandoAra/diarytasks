import { DbResult, runQuery, runWrite } from './client';
import { CreateTaskProps, Status } from '@/interfaces/TasksInterfaces';

/** Columns selected for every task read, kept in one place. */
const TASK_COLUMNS = 'id, title, description, status, priority, date';

const NOT_FOUND = 'No task found with the specified ID';

export async function createTask(data: CreateTaskProps): Promise<DbResult> {
    return runWrite(
        'create task',
        (db) => db.runAsync(
            'INSERT INTO Task (title, description, priority, status, date) VALUES (?, ?, ?, ?, ?)',
            [data.title, data.description, data.priority, data.status, data.date],
        ),
        { success: 'Task created successfully', notFound: 'Error inserting task' },
    );
}

export async function updateTaskById(id: string, data: CreateTaskProps): Promise<DbResult> {
    return runWrite(
        'update task',
        (db) => db.runAsync(
            `UPDATE Task SET
                 title = ?,
                 description = ?,
                 priority = ?,
                 status = ?,
                 date = ?,
                 updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [data.title, data.description, data.priority, data.status, data.date, id],
        ),
        { success: 'Task updated successfully', notFound: NOT_FOUND },
    );
}

/**
 * Persists an explicit status.
 *
 * This used to invert whatever status it was handed, while its only caller
 * already passed the *new* status - so the two inversions cancelled out and the
 * old status was written back. It now stores exactly what it receives.
 */
export async function updateTaskStatus(id: string, status: Status): Promise<DbResult> {
    return runWrite(
        'update task status',
        (db) => db.runAsync(
            'UPDATE Task SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id],
        ),
        { success: 'Status updated successfully', notFound: NOT_FOUND },
    );
}

export async function deleteTaskById(id: string): Promise<DbResult> {
    return runWrite(
        'delete task',
        (db) => db.runAsync('DELETE FROM Task WHERE id = ?', [id]),
        { success: 'Task deleted successfully', notFound: NOT_FOUND },
    );
}

export async function getTasksByDate(date: string): Promise<DbResult<CreateTaskProps[]>> {
    return runQuery('get tasks by date', (db) =>
        db.getAllAsync<CreateTaskProps>(
            `SELECT ${TASK_COLUMNS} FROM Task WHERE date = ? ORDER BY id`,
            [date],
        ),
    );
}

export async function getAllTasks(): Promise<DbResult<CreateTaskProps[]>> {
    return runQuery('get all tasks', (db) =>
        db.getAllAsync<CreateTaskProps>(`SELECT ${TASK_COLUMNS} FROM Task ORDER BY id`),
    );
}
