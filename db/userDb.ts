import { DbResult, runQuery } from './client';

export interface User {
    id: string;
    name: string;
}

export const DEFAULT_USER_NAME = 'Unknown';

export async function createUser(name: string): Promise<DbResult<User>> {
    const result = await runQuery('create user', async (db) => {
        const existing = await db.getFirstAsync<{ id: number; name: string }>(
            'SELECT id, name FROM User WHERE name = ?',
            [name],
        );

        if (existing) {
            return { id: String(existing.id), name: existing.name };
        }

        const inserted = await db.runAsync('INSERT INTO User (name) VALUES (?)', [name]);
        return { id: String(inserted.lastInsertRowId), name };
    });

    return result;
}

export async function updateUser(id: string, name: string): Promise<DbResult<User>> {
    const result = await runQuery('update user', (db) =>
        db.runAsync(
            'UPDATE User SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [name, id],
        ),
    );

    if (!result.success) {
        return { success: false, message: result.message, error: result.error };
    }

    if (!result.data?.changes) {
        // No row with that id - fall back to creating the user.
        const created = await createUser(name);
        return {
            success: created.success,
            data: created.data,
            message: 'No user found with the specified ID, new user created',
        };
    }

    return { success: true, data: { id, name }, message: 'User updated successfully' };
}

/**
 * Returns the single local user, creating a default one when the table is
 * empty.
 *
 * Previously this returned a JSON *string* that callers had to `JSON.parse`,
 * and its error branch returned the plain text "Error getting user" - which
 * threw inside the caller's parse and left the app stuck on the loader. It now
 * returns a typed object and never throws.
 */
export async function getUser(): Promise<User> {
    const result = await runQuery('get user', (db) =>
        db.getFirstAsync<{ id: number; name: string }>('SELECT id, name FROM User ORDER BY id LIMIT 1'),
    );

    if (result.success && result.data) {
        return { id: String(result.data.id), name: result.data.name };
    }

    if (result.success) {
        // Table is empty: seed a default user so the greeting has something.
        const created = await createUser(DEFAULT_USER_NAME);
        return created.data ?? { id: '', name: DEFAULT_USER_NAME };
    }

    return { id: '', name: DEFAULT_USER_NAME };
}
