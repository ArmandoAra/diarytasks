import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

import { DATABASE_NAME, getDb, runQuery } from './client';

const SQLITE_DIRECTORY = `${FileSystem.documentDirectory}SQLite/`;

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    date TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id));

CREATE TABLE IF NOT EXISTS TaskTemplate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id));

CREATE TABLE IF NOT EXISTS Note (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT,
    message TEXT,
    isFavorite INTEGER DEFAULT 0,
    date TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id));

CREATE INDEX IF NOT EXISTS idx_task_date ON Task(date);
CREATE INDEX IF NOT EXISTS idx_note_date ON Note(date);
CREATE INDEX IF NOT EXISTS idx_note_favorite ON Note(isFavorite);
`;

/** Creates every table/index if missing. Safe to run on each start. */
export async function createDatabaseStructure() {
    return runQuery('create database structure', (db) => db.execAsync(SCHEMA));
}

/**
 * Copies the seed database out of `assets/` on first launch, then makes sure
 * the schema is up to date.
 *
 * Runs the schema step exactly once - the previous version called it twice
 * (a second time without awaiting), which raced with the first call.
 */
export async function loadDatabase(): Promise<{ success: boolean; message: string }> {
    try {
        const destination = SQLITE_DIRECTORY + DATABASE_NAME;
        const info = await FileSystem.getInfoAsync(destination);

        if (!info.exists) {
            const asset = Asset.fromModule(require('@/assets/db/diaryTasks.db'));
            await asset.downloadAsync();

            await FileSystem.makeDirectoryAsync(SQLITE_DIRECTORY, { intermediates: true });
            await FileSystem.downloadAsync(asset.uri, destination);
        }

        const schema = await createDatabaseStructure();
        if (!schema.success) {
            return { success: false, message: 'Error creating database structure' };
        }

        return { success: true, message: 'Database loaded' };
    } catch (error) {
        console.error('[db] loadDatabase failed:', error);
        return { success: false, message: 'Error loading database' };
    }
}

export { getDb, DATABASE_NAME };
