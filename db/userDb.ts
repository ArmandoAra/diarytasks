import * as SQLite from 'expo-sqlite';

export async function createUser(
    name: string,
) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        const result = await db.getAllAsync<{ name: string }>(`SELECT name FROM User WHERE name = ?`, [name])
        if (result.length === 0) {
            // Si no existe el usuario, entonces lo inserta
            await db.runAsync('INSERT INTO User (name) VALUES (?)', [name]);
        }
    }
    catch (error) {
        console.log('Error CreatingUser', error)
    }
    db.closeAsync()
};

export async function updateUser(
    id: string,
    name: string,) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        const result = await db.runAsync(
            `UPDATE User SET
                 name = ? 
             WHERE id = ?`,
            [
                name,
                id
            ]
        );

        // Verificar si la tarea fue actualizada
        if (result.changes > 0) {
            console.log('User updated successfully');

            return { success: true, message: 'User updated successfully' };
        } else {
            createUser(name)
            return { success: false, message: 'No User found with the specified ID, New user created  ' };
        }
    } catch (error) {
        console.log('Error updating User:', error);
        return { success: false, message: 'Error updating User', error };
    }
}

export async function getUser(): Promise<string> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');
    try {
        const result = await db.getAllAsync<{ name: string, id: number }>('SELECT name,id FROM User')
        if (result.length == 0) {
            createUser("Unknow")
            return JSON.stringify({ name: "Unknow", id: "1" })
        } else {
            return JSON.stringify({ name: result[0].name, id: result[0].id.toString() })
        }
    } catch (error) {
        console.log('Error getting user on GetUser')
        return "Error getting user"
    }
}