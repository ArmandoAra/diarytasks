import * as SQLite from 'expo-sqlite';

/**
 * Ordered schema migrations.
 *
 * The database tracks how many have run in SQLite's own `PRAGMA user_version`,
 * so each one is applied exactly once per device. Append new migrations to the
 * end of this array and never reorder or edit the ones already released.
 */
interface Migration {
    name: string;
    up: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

/**
 * `DD-MM-YYYY` -> `YYYY-MM-DD`.
 *
 * The old format could not be sorted or range-queried in SQL, so every
 * chronological operation had to pull all rows and sort them in JS. ISO dates
 * sort lexicographically, which makes `ORDER BY date` and `BETWEEN` work.
 *
 * The `LIKE '__-__-____'` guard only matches the old layout (dashes at
 * positions 3 and 6); ISO dates have them at 5 and 8, so rows that were
 * already converted are left alone.
 */
const toIsoDates: Migration = {
    name: 'convert dates to ISO (YYYY-MM-DD)',
    up: async (db) => {
        for (const table of ['Task', 'Note']) {
            await db.runAsync(
                `UPDATE ${table}
                    SET date = substr(date, 7, 4) || '-' || substr(date, 4, 2) || '-' || substr(date, 1, 2)
                  WHERE date LIKE '__-__-____'`,
            );
        }
    },
};

/**
 * Attachments for notes.
 *
 * `path` and `thumbPath` are relative to `FileSystem.documentDirectory` - see
 * `Utils/mediaStorage.ts` for why absolute URIs are not stored.
 *
 * ON DELETE CASCADE only removes the rows; the files are deleted explicitly by
 * `deleteMediaForNote`, since SQLite cannot touch the filesystem.
 */
const noteMedia: Migration = {
    name: 'add NoteMedia table',
    up: async (db) => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS NoteMedia (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                noteId      INTEGER NOT NULL,
                kind        TEXT NOT NULL CHECK (kind IN ('image', 'video')),
                path        TEXT NOT NULL,
                thumbPath   TEXT,
                width       INTEGER,
                height      INTEGER,
                durationMs  INTEGER,
                orderIndex  INTEGER NOT NULL DEFAULT 0,
                createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (noteId) REFERENCES Note(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_media_note ON NoteMedia(noteId, orderIndex);
        `);
    },
};

const MIGRATIONS: Migration[] = [toIsoDates, noteMedia];

/**
 * Applies every migration the database has not seen yet.
 *
 * Each one runs inside its own transaction, so a failure halfway through
 * leaves the database on the last version that fully succeeded rather than in
 * a partially migrated state.
 */
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const current = row?.user_version ?? 0;

    if (current >= MIGRATIONS.length) return;

    for (let version = current; version < MIGRATIONS.length; version++) {
        const migration = MIGRATIONS[version];

        await db.withTransactionAsync(async () => {
            await migration.up(db);
            // PRAGMA does not accept bound parameters, and `version + 1` is a
            // loop counter rather than user input.
            await db.execAsync(`PRAGMA user_version = ${version + 1}`);
        });

        console.log(`[db] migration ${version + 1} applied: ${migration.name}`);
    }
}
