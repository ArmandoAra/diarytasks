import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'diaryTasks.db';

/**
 * Single shared connection for the whole app.
 *
 * Every db helper used to call `openDatabaseAsync` on its own, which opened a
 * brand new connection on every read/write and never closed it. Keeping one
 * lazily-created connection avoids that leak and guarantees all callers see the
 * same WAL state.
 */
let connection: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!connection) {
        connection = SQLite.openDatabaseAsync(DATABASE_NAME).catch((error) => {
            // Never cache a rejected promise: a transient failure would
            // otherwise poison every later call.
            connection = null;
            throw error;
        });
    }
    return connection;
}

/** Closes the shared connection. Mainly useful for tests. */
export async function closeDb(): Promise<void> {
    if (!connection) return;
    const db = await connection.catch(() => null);
    connection = null;
    await db?.closeAsync();
}

/** Shape returned by every db helper, so callers can branch on one contract. */
export interface DbResult<T = void> {
    success: boolean;
    data?: T;
    message?: string;
    error?: unknown;
}

/**
 * Wraps a db call so a thrown error becomes a `DbResult` instead of crashing
 * the caller. `context` is used for the log line and the failure message.
 */
export async function runQuery<T>(
    context: string,
    query: (db: SQLite.SQLiteDatabase) => Promise<T>,
): Promise<DbResult<T>> {
    try {
        const db = await getDb();
        return { success: true, data: await query(db) };
    } catch (error) {
        console.error(`[db] ${context} failed:`, error);
        return { success: false, message: `${context} failed`, error };
    }
}

/**
 * Runs a write (INSERT/UPDATE/DELETE) and normalises the outcome.
 *
 * A statement that touches zero rows is reported as a failure, since for every
 * caller here that means "no row with that id".
 */
export async function runWrite(
    context: string,
    query: (db: SQLite.SQLiteDatabase) => Promise<SQLite.SQLiteRunResult>,
    messages: { success: string; notFound: string },
): Promise<DbResult> {
    const result = await runQuery(context, query);

    if (!result.success) {
        return { success: false, message: result.message, error: result.error };
    }

    if (!result.data?.changes) {
        return { success: false, message: messages.notFound };
    }

    return { success: true, message: messages.success };
}
