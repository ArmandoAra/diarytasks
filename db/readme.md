Paso a paso
En la web de SQLite3 descargue el archivo de instalacion en window que es un zip.
Lo decomprimi y copie en una carpeta que cree nueva en C/ con el nombre SQLite3.
En las variables de entorno en Path agregue la ruta de la carpeta anterior y ya puedo utilizar el comando sqlite3

En la terminal me dirigi a la carpeta donde queria crear la base de datos y ejecute el comando sqlite3 nombreDB.db
Luego en la terminal fui insertando las tablas
{
######FORMATO DE LAS TABLAS#####
CREATE TABLE IF NOT EXISTS User (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
name TEXT,
password TEXT,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
}

Luego inserte los datos de prueba (en este caso agregue 3 usuarios)
(Normalmente deberia estar la DB limpia este caso es de prueba)
{
########FORMATO DE INSERCION DE DATOS######
INSERT INTO User (email, name, password) VALUES ('john.doe@example.com', 'John Doe', 'password123');
}

-[Movi el archivo db a la carpeta assets/db/mf.db]

DEPENDENCIAS
"expo-asset": "~10.0.10",
"expo-file-system": "~17.0.1",
"expo-sqlite": "~14.0.4",

Luego en el componente App()
//DB
import _ as SQLite from 'expo-sqlite';
import _ as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

//Cargamos la imagen de la base de datos creada mf.db
//Funcion de ayruda para cargar la base de datos que podemos mover a otro archivo
const loadDatabase = async () => {
const dbName = 'mf.db';
const dbAsset = require('../assets/db/mf.db');// db file in assets folder
const dbUri = Asset.fromModule(dbAsset).uri; // get the uri of the db file
const dbDir = FileSystem.documentDirectory + 'SQLite/' + dbName; // directory to store the db file

    const dbInfo = await FileSystem.getInfoAsync(dbDir); // check if the db file exists
    if (!dbInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite/', { intermediates: true });
        await FileSystem.downloadAsync(dbUri, dbDir); // download the db file
    }

}

En la terminal ejecutamos el comando y crea el archivo de configuracion de expo para hacer que reconozca el archivo .db
reeplazamos el codigo por el siguiente en el ejemplo.
npx expo customize metro.config.js

{ Ejemplo de codigo en el archivo de metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

        const defaultConfig = getDefaultConfig(\_\_dirname);

        defaultConfig.resolver.assetExts.push("db");

        module.exports = defaultConfig;

}
