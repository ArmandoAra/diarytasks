
import * as SQLite from 'expo-sqlite';




// User
// Insert User
export async function createUser(
    name: string,
    setUser: React.Dispatch<React.SetStateAction<string>>,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        setLoading(true)
        const result = await db.getAllAsync<{ name: string }>(`SELECT name FROM User WHERE name = ?`, [name])

        if (result.length === 0) {
            // Si no existe el usuario, entonces lo inserta
            await db.runAsync('INSERT INTO User (name) VALUES (?)', [name])
            setUser(name)
            setIsLogged(true)
        }
        setLoading(false)
    }
    catch (error) {
        console.log('Error CreatingUser', error)
    }
    db.closeAsync()
}


export async function getUser(
    setUser: React.Dispatch<React.SetStateAction<string>>,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
) {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');
    try {
        const result = await db.getAllAsync<{ name: string }>('SELECT name FROM User')
        if (result.length === 0) {
            setIsLogged(false)
        } else {
            setIsLogged(true)
            setUser(result[0].name)
        }
    } catch (error) {
        console.log('Error getting user on GetUser')
    }
}