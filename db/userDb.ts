
import * as SQLite from 'expo-sqlite';

interface User {
    id: string;
    name: string;
}


// User
// Insert User
export async function createUser(
    name: string,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        setLoading(true)
        const result = await db.getAllAsync<{ name: string }>(`SELECT name FROM User WHERE name = ?`, [name])

        if (result.length === 0) {
            // Si no existe el usuario, entonces lo inserta
            await db.runAsync('INSERT INTO User (name) VALUES (?)', [name])
        }
        setLoading(false)
    }
    catch (error) {
        console.log('Error CreatingUser', error)
    }
    db.closeAsync()
};

export async function updateUser(
    id: string,
    name: string,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        setLoading(true)
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
            setUser({ name, id })
            setLoading(false)
            return { success: true, message: 'User updated successfully' };
        } else {
            console.log('No User found with the specified ID');
            return { success: false, message: 'No User found with the specified ID' };
        }
    } catch (error) {
        console.log('Error updating User:', error);
        return { success: false, message: 'Error updating User', error };
    }
}


export async function getUser(
    setUser: React.Dispatch<React.SetStateAction<{ name: string, id: string }>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');
    try {
        const result = await db.getAllAsync<{ name: string, id: number }>('SELECT name,id FROM User')
        if (result.length == 0) {
            console.log(result)
            createUser("Unknow", setUser, setLoading)
            return "no user";
        } else {
            setUser({ name: result[0].name, id: result[0].id.toString() })
            // return JSON.stringify(result[0].id)
        }
    } catch (error) {
        console.log('Error getting user on GetUser')
    }
}