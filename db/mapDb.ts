import { DbResult, runQuery } from './client';
import { getUniqueDates, MONTH_NAMES, processTasks, splitDate } from '@/Utils/helpFunctions';

export interface DayWithTasks {
    date: string;
    allTasksCompleted: boolean;
}

/** One calendar cell on the Map tab. */
export interface CalendarDay {
    date: string;
    allTasksCompleted: boolean;
    haveTask: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}

export async function getAllDaysWithData(): Promise<DbResult<DayWithTasks[]>> {
    const result = await runQuery('get days with tasks', (db) =>
        db.getAllAsync<{ date: string; status: string }>('SELECT date, status FROM Task'),
    );

    if (!result.success || !result.data) return { ...result, data: [] };
    return { success: true, data: processTasks(result.data) };
}

export async function getAllDaysWithNotes(): Promise<DbResult<string[]>> {
    const result = await runQuery('get days with notes', (db) =>
        db.getAllAsync<{ date: string }>('SELECT date FROM Note'),
    );

    if (!result.success || !result.data) return { ...result, data: [] };
    return { success: true, data: getUniqueDates(result.data) };
}

/**
 * Merges the days that have tasks with the days that have notes into the flat
 * list the Map tab renders.
 */
export async function getSortedDaysWithNotesAndTasks(): Promise<CalendarDay[]> {
    const [tasksResponse, notesResponse] = await Promise.all([
        getAllDaysWithData(),
        getAllDaysWithNotes(),
    ]);

    const tasks = tasksResponse.data ?? [];
    const notes = notesResponse.data ?? [];

    const taskByDate = new Map(tasks.map((task) => [task.date, task]));
    const noteDates = new Set(notes);

    // Union of both sets of dates, ignoring empty/null values coming from rows
    // that were saved without a date.
    const allDates = new Set([...taskByDate.keys(), ...noteDates].filter(Boolean));

    return Array.from(allDates).map((date) => {
        const task = taskByDate.get(date);
        const { day, month, year } = splitDate(date);

        return {
            date,
            allTasksCompleted: task?.allTasksCompleted ?? false,
            haveTask: Boolean(task),
            haveNote: noteDates.has(date),
            day,
            month: MONTH_NAMES[Number(month) - 1] ?? 'Unknown',
            year,
        };
    });
}
