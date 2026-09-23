import {
    addDays,
    formatDate,
    formatDateToString,
    getBackDay,
    getMonthNumber,
    getNextDay,
    getUniqueDates,
    findNoteById,
    findTaskById,
    parseDate,
    priorityColorHandler,
    processTasks,
    splitDate,
} from '../helpFunctions';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';

describe('date formatting', () => {
    it('formats a Date as zero-padded DD-MM-YYYY', () => {
        expect(formatDate(new Date(2025, 0, 5))).toBe('05-01-2025');
        expect(formatDate(new Date(2025, 11, 31))).toBe('31-12-2025');
    });

    it('round-trips through parseDate', () => {
        expect(formatDate(parseDate('09-03-2025'))).toBe('09-03-2025');
    });

    it('splits a date string into its parts', () => {
        expect(splitDate('09-03-2025')).toEqual({ day: '09', month: '03', year: '2025' });
    });
});

describe('day navigation', () => {
    it('moves forward and back by one day', () => {
        expect(getNextDay('01-01-2025')).toBe('02-01-2025');
        expect(getBackDay('02-01-2025')).toBe('01-01-2025');
    });

    it('crosses month boundaries', () => {
        expect(getNextDay('31-01-2025')).toBe('01-02-2025');
        expect(getBackDay('01-03-2025')).toBe('28-02-2025');
    });

    it('crosses year boundaries', () => {
        expect(getNextDay('31-12-2025')).toBe('01-01-2026');
        expect(getBackDay('01-01-2025')).toBe('31-12-2024');
    });

    it('handles leap days', () => {
        expect(getNextDay('28-02-2024')).toBe('29-02-2024');
        expect(addDays('29-02-2024', 1)).toBe('01-03-2024');
    });
});

describe('formatDateToString', () => {
    it('adds the right ordinal suffix', () => {
        expect(formatDateToString('01-01-2025')).toBe('Day selected is January 1st, 2025');
        expect(formatDateToString('02-01-2025')).toBe('Day selected is January 2nd, 2025');
        expect(formatDateToString('03-01-2025')).toBe('Day selected is January 3rd, 2025');
        expect(formatDateToString('04-01-2025')).toBe('Day selected is January 4th, 2025');
    });

    it('uses "th" for the 11-13 exception', () => {
        expect(formatDateToString('11-01-2025')).toContain('11th');
        expect(formatDateToString('12-01-2025')).toContain('12th');
        expect(formatDateToString('13-01-2025')).toContain('13th');
        expect(formatDateToString('21-01-2025')).toContain('21st');
    });

    it('does not throw on an unparseable date', () => {
        expect(formatDateToString('')).toBe('No day selected');
    });
});

describe('getMonthNumber', () => {
    it('maps month names to zero-padded numbers, case-insensitively', () => {
        expect(getMonthNumber('January')).toBe('01');
        expect(getMonthNumber('september')).toBe('09');
        expect(getMonthNumber('DECEMBER')).toBe('12');
    });

    it('returns null for an unknown month', () => {
        expect(getMonthNumber('Smarch')).toBeNull();
    });
});

describe('getUniqueDates', () => {
    it('dedupes and sorts chronologically, not lexicographically', () => {
        expect(getUniqueDates([
            { date: '02-01-2025' },
            { date: '01-02-2025' },
            { date: '02-01-2025' },
            { date: '31-12-2024' },
        ])).toEqual(['31-12-2024', '02-01-2025', '01-02-2025']);
    });

    it('drops empty dates', () => {
        expect(getUniqueDates([{ date: '' }, { date: '01-01-2025' }])).toEqual(['01-01-2025']);
    });
});

describe('processTasks', () => {
    it('flags a day as complete only when every task is Completed', () => {
        expect(processTasks([
            { date: '01-01-2025', status: 'Completed' },
            { date: '01-01-2025', status: 'ToDo' },
            { date: '02-01-2025', status: 'Completed' },
        ])).toEqual([
            { date: '01-01-2025', allTasksCompleted: false },
            { date: '02-01-2025', allTasksCompleted: true },
        ]);
    });

    it('ignores rows saved without a date', () => {
        expect(processTasks([{ date: '', status: 'ToDo' }])).toEqual([]);
    });
});

describe('lookup helpers', () => {
    const tasks = [{ id: '7', title: 'a' }] as CreateTaskProps[];
    const notes = [{ id: '7', title: 'a' }] as CreateNoteProps[];

    it('matches ids across string/number representations', () => {
        // SQLite returns INTEGER ids even though the interfaces declare string.
        expect(findTaskById(7 as unknown as string, tasks)?.title).toBe('a');
        expect(findNoteById('7', notes)?.title).toBe('a');
    });

    it('returns undefined when nothing matches', () => {
        expect(findTaskById('999', tasks)).toBeUndefined();
    });
});

describe('priorityColorHandler', () => {
    it('returns a colour per priority', () => {
        expect(priorityColorHandler('High')).toBe('#E05D5D');
        expect(priorityColorHandler('Medium')).toBe('#FFB344');
        expect(priorityColorHandler('Low')).toBe('#00A19D');
    });

    it('never returns undefined for an unknown priority', () => {
        expect(priorityColorHandler('bogus')).toBe('#00A19D');
    });
});
