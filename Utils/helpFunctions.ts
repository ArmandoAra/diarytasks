import { CreateNoteProps } from "@/interfaces/NotesInterfaces";
import { CreateTaskProps } from "@/interfaces/TasksInterfaces";

import { Colors } from "@/constants/Colors";



// Generador de Id
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;


// Formateando fecha
const rawDate = "\"2025-01-25T21:13:16.895Z\""; // Fecha en formato recibido
const parsedDate = new Date(JSON.parse(rawDate)); // Parsear la cadena a un objeto Date

// Extraer día, mes y año
const day = String(parsedDate.getDate()).padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
const year = String(parsedDate.getFullYear()).slice(-4); // Obtener los últimos 2 dígitos del año

export function formatDate(parsedDate: Date) {
    // Extraer día, mes y año
    const day = String(parsedDate.getDate()).padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
    const year = String(parsedDate.getFullYear()).slice(-4); // Obtener los últimos 2 dígitos del año

    // Formatear la fecha
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export function formatDateToString(dateString: string): string {
    // Dividir el string recibido en partes (día, mes, año)
    const [day, month, year] = dateString.split('-').map(Number);

    // Crear un objeto Date
    const date = new Date(year, month - 1, day); // Meses comienzan en 0

    // Obtener el nombre del mes en inglés
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()];

    // Agregar sufijo al día (st, nd, rd, th)
    const daySuffix = (d: number) => {
        if (d >= 11 && d <= 13) return "th"; // Excepción para 11, 12, 13
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    // Construir la cadena de salida
    return `Day selected is ${monthName} ${day}${daySuffix(day)}, ${year}`;
}

export const getMonthNumber = (monthName: string): string | null => {
    const monthNames: { [key: string]: string } = {
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12"
    };

    return monthNames[monthName.toLowerCase()] || null;
};

// recibe la fecha como string, la convierte en DATE , Le suma un dia y devuelve el mismo formato de string.
export const getBackDay = (dateString: string): string => {
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() - 1); // Resta un dia

    // Formatear de nuevo a "DD-MM-YYYY"
    const nextDay = String(date.getDate()).padStart(2, "0");
    const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nextYear = date.getFullYear();

    return `${nextDay}-${nextMonth}-${nextYear}`;
};

export const getNextDay = (dateString: string): string => {
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() + 1); // Sumar un día

    // Formatear de nuevo a "DD-MM-YYYY"
    const nextDay = String(date.getDate()).padStart(2, "0");
    const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nextYear = date.getFullYear();

    return `${nextDay}-${nextMonth}-${nextYear}`;
};

// This two function i made to find the task or note that i want to edit and do not search again into db ([id].tsx)
export function searchTaskById(id: string | string[], data: CreateTaskProps[]) {
    const result = data.filter((task) => task.id == id);
    return result;
}

export function searchNoteById(id: string | string[], data: CreateNoteProps[]) {
    const result = data.filter((note) => note.id == id);
    return result;
}

// Imported in task.tsx
export function priorityColorHandler(priority: string) {
    switch (priority) {
        case "High":
            return "#E05D5D"
        case "Medium":
            return "#FFB344"
        case "Low":
            return "#00A19D";
    }
}

// Imported in MapScreen
// Función para agrupar por mes y año
export const groupByMonthYear = (dates: string[]): Record<string, string[]> => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return dates.reduce((acc, date) => {
        const [day, month, year] = date.split('-');
        const monthYear = `${months[parseInt(month) - 1]} ${year}`;

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }

        acc[monthYear].push(day);
        return acc;
    }, {} as Record<string, string[]>);
};


export const getUniqueDates = (data: { date: string }[]): string[] => {
    //     Explicación del Código
    // map(item => item.date):

    // Extrae solo las fechas del array de objetos.
    // new Set([...]):

    // Elimina duplicados convirtiendo el array en un Set y luego de vuelta a un array.
    // Ordenar con sort:

    // Divide cada fecha en día, mes y año (split('-')).
    // Convierte los valores en Number para asegurarse de que la comparación es numérica.
    // Crea un objeto Date(year, month - 1, day) y compara los timestamps.
    const uniqueDates = [...new Set(data.map(item => item.date))];

    // Ordenar fechas en formato DD-MM-YYYY
    return uniqueDates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);

        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
    });
};


// Imported in taskDb.ts
export function processTasks(tasks: { date: string; status: string }[]): { date: string; allTasksCompleted: boolean }[] {

    // Aquí se crea un objeto vacío taskMap donde cada clave será una fecha y su valor será 
    // un array de estados ("ToDo", "Completed")
    const taskMap: Record<string, string[]> = {};

    // Se recorre el array tasks y se organiza en taskMap, de manera que todas las tareas 
    // con la misma fecha se agrupan en un array de estados.
    // { "29-01-2025": ["Completed", "ToDo", "ToDo", "ToDo", "ToDo"],...}
    tasks.forEach(({ date, status }) => {
        if (!taskMap[date]) {
            taskMap[date] = [];
        }
        taskMap[date].push(status);
    });

    //     Object.keys(taskMap) obtiene un array con todas las fechas únicas.
    // .map(date => { ... }) transforma cada fecha en un objeto con:
    // date: la fecha única.
    // allTasksCompleted: se evalúa con .every(status => status === "Completed"), lo que significa que si todas las tareas de ese día tienen el estado "Completed", será true; de lo contrario, false.
    return Object.keys(taskMap).map(date => ({
        date,
        allTasksCompleted: taskMap[date].every(status => status === "Completed"),
    }));
}


