import {
    addDays,
    formatDate,
    formatDateToString,
    getBackDay,
    getMonthNumber,
    getNextDay,
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
    it('formats a Date as zero-padded ISO YYYY-MM-DD', () => {
        expect(formatDate(new Date(2025, 0, 5))).toBe('2025-01-05');
        expect(formatDate(new Date(2025, 11, 31))).toBe('2025-12-31');
    });

    it('round-trips through parseDate', () => {
        expect(formatDate(parseDate('2025-03-09'))).toBe('2025-03-09');
    });

    it('splits a date string into its parts', () => {
        expect(splitDate('2025-03-09')).toEqual({ day: '09', month: '03', year: '2025' });
    });
});

describe('day navigation', () => {
    it('moves forward and back by one day', () => {
        expect(getNextDay('2025-01-01')).toBe('2025-01-02');
        expect(getBackDay('2025-01-02')).toBe('2025-01-01');
    });

    it('crosses month boundaries', () => {
        expect(getNextDay('2025-01-31')).toBe('2025-02-01');
        expect(getBackDay('2025-03-01')).toBe('2025-02-28');
    });

    it('crosses year boundaries', () => {
        expect(getNextDay('2025-12-31')).toBe('2026-01-01');
        expect(getBackDay('2025-01-01')).toBe('2024-12-31');
    });

    it('handles leap days', () => {
        expect(getNextDay('2024-02-28')).toBe('2024-02-29');
        expect(addDays('2024-02-29', 1)).toBe('2024-03-01');
    });
});

describe('formatDateToString', () => {
    it('adds the right ordinal suffix', () => {
        expect(formatDateToString('2025-01-01')).toBe('Day selected is January 1st, 2025');
        expect(formatDateToString('2025-01-02')).toBe('Day selected is January 2nd, 2025');
        expect(formatDateToString('2025-01-03')).toBe('Day selected is January 3rd, 2025');
        expect(formatDateToString('2025-01-04')).toBe('Day selected is January 4th, 2025');
    });

    it('uses "th" for the 11-13 exception', () => {
        expect(formatDateToString('2025-01-11')).toContain('11th');
        expect(formatDateToString('2025-01-12')).toContain('12th');
        expect(formatDateToString('2025-01-13')).toContain('13th');
        expect(formatDateToString('2025-01-21')).toContain('21st');
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

describe('processTasks', () => {
    it('flags a day as complete only when every task is Completed', () => {
        expect(processTasks([
            { date: '2025-01-01', status: 'Completed' },
            { date: '2025-01-01', status: 'ToDo' },
            { date: '2025-01-02', status: 'Completed' },
        ])).toEqual([
            { date: '2025-01-01', allTasksCompleted: false },
            { date: '2025-01-02', allTasksCompleted: true },
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

describe('ISO date ordering', () => {
    it('sorts as plain strings, which is what lets SQL use ORDER BY', () => {
        const dates = ['2025-02-01', '2024-12-31', '2025-01-02'];
        expect([...dates].sort()).toEqual(['2024-12-31', '2025-01-02', '2025-02-01']);
    });
});

describe('legacy date conversion (mirrors the SQL migration)', () => {
    // The migration rewrites DD-MM-YYYY with substr(); this checks the same
    // transformation and, critically, that it is a no-op on ISO rows.
    const convert = (d: string) =>
        /^\d{2}-\d{2}-\d{4}$/.test(d) ? `${d.slice(6, 10)}-${d.slice(3, 5)}-${d.slice(0, 2)}` : d;

    it('converts the old format', () => {
        expect(convert('09-03-2025')).toBe('2025-03-09');
        expect(convert('31-12-2024')).toBe('2024-12-31');
    });

    it('leaves already-converted rows untouched', () => {
        expect(convert('2025-03-09')).toBe('2025-03-09');
    });
});
