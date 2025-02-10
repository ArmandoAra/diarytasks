// Db
import * as SQLite from 'expo-sqlite';

// Utils
import { processTasks, getUniqueDates } from '@/Utils/helpFunctions';
import { Try } from 'expo-router/build/views/Try';

interface AllDaysWithDataProps {
    date: string;
    status: string;
}

interface DaysWithTasksCompletedProps {
    date: string;
    allTasksCompleted: boolean;
}

export async function getAllDaysWithData(): Promise<{ success?: boolean; data?: DaysWithTasksCompletedProps[]; message?: string; error?: any }> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar todas las tareas  as { date: string }[]
        const result = await db.getAllAsync(`SELECT date,status FROM Task`);
        const daysWithTasks = (processTasks(result as AllDaysWithDataProps[]));

        return { success: true, data: daysWithTasks };
    } catch {
        return { success: false, message: 'No tasks found or invalid format' };
    }
}

export async function getAllDaysWithNotes(): Promise<{ success?: boolean; data?: string[]; message?: string; error?: any }> {
    const db = await SQLite.openDatabaseAsync('diaryTasks.db');

    try {
        // Consultar todas las tareas  as { date: string }[]
        const result = await db.getAllAsync(`SELECT date FROM Note`);
        const uiqueNoteDates = getUniqueDates(result as { date: string }[])

        return { success: true, data: uiqueNoteDates };
    } catch {
        return { success: false, message: 'No Notes found or invalid format' };
    }
}

// export async function getSortedDaysWithNotesAndTasks() {
//     let result: ResultProps = {}
//     // getAllDaysWithData().then((result) => console.log(result.data));
//     // const notes = getAllDaysWithNotes().then((result) => console.log(result.data));
//     const tasks = [
//         { "allTasksCompleted": false, "date": "28-01-2025" },
//         { "allTasksCompleted": false, "date": "29-01-2025" },
//         { "allTasksCompleted": false, "date": "05-02-2025" },
//         { "allTasksCompleted": false, "date": "07-02-2025" },
//         { "allTasksCompleted": false, "date": "08-02-2025" },
//         { "allTasksCompleted": false, "date": "06-02-2025" },
//         { "allTasksCompleted": false, "date": "04-02-2025" },
//         { "allTasksCompleted": false, "date": "10-02-2025" },
//         { "allTasksCompleted": false, "date": "09-02-2025" },
//         { "allTasksCompleted": false, "date": "03-02-2025" },
//         { "allTasksCompleted": false, "date": "26-02-2025" },
//         { "allTasksCompleted": false, "date": "16-03-2025" }
//     ]
//     const notes = ["28-01-2025", "29-01-2025", "30-01-2025", "05-02-2025", "07-02-2025", "08-02-2025", "10-02-2025"]
//     // Unir las fechas de las notas y las tareas
//     const allDates = [tasks.map(item => item.date), notes].flat();
//     // Eliminar duplicados y ordenar
//     const formatBeforeSort = allDates.map(date => ({ date }));
//     const sortedDates = getUniqueDates(formatBeforeSort);

//     console.log(formatBeforeSort)
// }
// tasks: { date: string; allTasksCompleted: boolean }[], notes: string[]
export async function getSortedDaysWithNotesAndTasks() {
    try {
        // Obtener ambas consultas en paralelo
        const [tasksResponse, notesResponse] = await Promise.all([
            getAllDaysWithData(),
            getAllDaysWithNotes()
        ]);

        const tasks = tasksResponse.data || [];
        const notes = notesResponse.data || [];

        // Mapeo de números de mes a nombres en inglés
        const monthNames: { [key: string]: string } = {
            "01": "January", "02": "February", "03": "March", "04": "April",
            "05": "May", "06": "June", "07": "July", "08": "August",
            "09": "September", "10": "October", "11": "November", "12": "December"
        };

        // Transformar los datos
        const result = tasks.map(({ date, allTasksCompleted }) => {
            const [day, month, year] = date.split("-");
            return {
                date,
                allTasksCompleted,
                haveNote: notes.includes(date), // Verifica si la fecha está en `notes`
                day,
                month: monthNames[month] || "Unknown",
                year
            };
        });

        return result; // Devolver los datos procesados
    } catch (error) {
        console.error("Sorted Days error", error);
        return [];
    }
}

interface SortedDataProps {
    date: string;
    allTasksCompleted: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}
