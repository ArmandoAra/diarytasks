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
        const result = await db.getAllAsync(`SELECT date FROM Note`);
        const uiqueNoteDates = getUniqueDates(result as { date: string }[])

        return { success: true, data: uiqueNoteDates };
    } catch {
        return { success: false, message: 'No Notes found or invalid format' };
    }
}

export async function getSortedDaysWithNotesAndTasks(): Promise<{
    date: string;
    allTasksCompleted: boolean;
    haveTask: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}[]> {
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

        // Obtener todas las fechas únicas combinando tasks y notes
        const allDates = new Set([...tasks.map(t => t.date), ...notes.filter(n => n)]);
        // Unificamos las fechas: Creamos un Set con todas las fechas de tasks y notes, eliminando duplicados y asegurándonos de incluir todas las fechas.
        // Recorremos cada fecha: Convertimos el Set en un array y lo procesamos.
        // Buscamos la tarea asociada (si existe): Usamos .find() para obtener la tarea correspondiente.
        // Verificamos si hay una nota: Simplemente comprobamos si la fecha está en notes.
        // Añadimos haveTask: Es true si la fecha tiene una tarea asociada y false en caso contrario.
        // Mantenemos la estructura de datos: Descomponemos la fecha en día, mes y año con los nombres correctos.

        const result = Array.from(allDates).map(date => {
            const task = tasks.find(t => t.date === date);
            const haveNote = notes.includes(date);
            const [day, month, year] = date.split("-");

            return {
                date,
                allTasksCompleted: task ? task.allTasksCompleted : false,
                haveTask: task ? true : false,
                haveNote,
                day,
                month: monthNames[month] || "Unknown",
                year
            };
        });


        return result;
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



var tasks = [{ "allTasksCompleted": false, "date": "13-02-2025" },
{ "allTasksCompleted": false, "date": "14-02-2025" },
{ "allTasksCompleted": false, "date": "15-02-2025" }]


var notes = ["12-02-2025",
    "", "14-02-2025",
    "15-02-2025",
    "16-02-2025"]

var result = [{ "allTasksCompleted": false, "date": "13-02-2025", "day": "13", "haveNote": false, "month": "February", "year": "2025" },
{ "allTasksCompleted": false, "date": "14-02-2025", "day": "14", "haveNote": true, "month": "February", "year": "2025" },
{ "allTasksCompleted": false, "date": "15-02-2025", "day": "15", "haveNote": true, "month": "February", "year": "2025" }] 