import * as SQLite from 'expo-sqlite';

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset'; //Para obtener el Uri de el archivo de la Db



export const loadDatabase = async () => {
    const dbName = 'diaryTasks.db';
    try {
        const dbAsset = require('@/assets/db/diaryTasks.db');// db file in assets folder
        const dbUri = Asset.fromModule(dbAsset).uri; // get the uri of the db file
        const dbDir = FileSystem.documentDirectory + 'SQLite/' + dbName; // directory to store the db file

        const dbInfo = await FileSystem.getInfoAsync(dbDir); // check if the db file exists

        if (!dbInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite/', { intermediates: true });
            await FileSystem.downloadAsync(dbUri, dbDir); // download the db file
            // await createDatabaseStructure(); //Verificar si esto va aqui
        }
    } catch (err) {
        console.log(err)
    }

}


//Creando la estructura de la base de datos
export async function createDatabaseStructure() {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db', {
        useNewConnection: true,
    });
    try {
        await db.execAsync(`
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
        `);
    }
    catch (error) {
        console.log('Error creating database structure', error)
    }
}
