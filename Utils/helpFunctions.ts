import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';

/**
 * Dates are stored in SQLite as the string `DD-MM-YYYY` (not ISO). Every helper
 * below reads and writes that format - change them together if it ever moves.
 */
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Splits a `DD-MM-YYYY` string into its (still zero-padded) parts. */
export function splitDate(dateString: string): { day: string; month: string; year: string } {
    const [day = '', month = '', year = ''] = dateString.split('-');
    return { day, month, year };
}

/** Parses a `DD-MM-YYYY` string into a local `Date`. */
export function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/** Formats a `Date` as the `DD-MM-YYYY` string used everywhere in the db. */
export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`;
}

/** Adds `amount` days to a `DD-MM-YYYY` string and returns the same format. */
export function addDays(dateString: string, amount: number): string {
    const date = parseDate(dateString);
    date.setDate(date.getDate() + amount);
    return formatDate(date);
}

export const getBackDay = (dateString: string): string => addDays(dateString, -1);
export const getNextDay = (dateString: string): string => addDays(dateString, 1);

/** "1st", "2nd", "3rd", "4th"... */
function daySuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/** Human-readable banner text for the currently selected day. */
export function formatDateToString(dateString: string): string {
    const date = parseDate(dateString);
    if (Number.isNaN(date.getTime())) return 'No day selected';

    const monthName = MONTH_NAMES[date.getMonth()];
    const day = date.getDate();

    return `Day selected is ${monthName} ${day}${daySuffix(day)}, ${date.getFullYear()}`;
}

/** Month name -> zero-padded month number, or null when unrecognised. */
export const getMonthNumber = (monthName: string): string | null => {
    const index = MONTH_NAMES.findIndex(
        (name) => name.toLowerCase() === monthName.toLowerCase(),
    );

    return index === -1 ? null : String(index + 1).padStart(2, '0');
};

/** Looks a task up in the already-loaded day list instead of hitting the db. */
export function findTaskById(
    id: string | string[],
    data: CreateTaskProps[],
): CreateTaskProps | undefined {
    return data.find((task) => String(task.id) === String(id));
}

/** Looks a note up in the already-loaded day list instead of hitting the db. */
export function findNoteById(
    id: string | string[],
    data: CreateNoteProps[],
): CreateNoteProps | undefined {
    return data.find((note) => String(note.id) === String(id));
}

const PRIORITY_COLORS: Record<string, string> = {
    High: '#E05D5D',
    Medium: '#FFB344',
    Low: '#00A19D',
};

/** Background colour for the priority badge; falls back to the "Low" colour. */
export function priorityColorHandler(priority: string): string {
    return PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Low;
}

/** Unique dates from a row set, sorted chronologically. */
export const getUniqueDates = (data: { date: string }[]): string[] => {
    const uniqueDates = [...new Set(data.map((item) => item.date).filter(Boolean))];

    return uniqueDates.sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime());
};

/** Collapses task rows into one entry per date, flagging fully-done days. */
export function processTasks(
    tasks: { date: string; status: string }[],
): { date: string; allTasksCompleted: boolean }[] {
    const taskMap = new Map<string, string[]>();

    for (const { date, status } of tasks) {
        if (!date) continue;
        const statuses = taskMap.get(date);
        if (statuses) {
            statuses.push(status);
        } else {
            taskMap.set(date, [status]);
        }
    }

    return Array.from(taskMap, ([date, statuses]) => ({
        date,
        allTasksCompleted: statuses.every((status) => status === 'Completed'),
    }));
}
