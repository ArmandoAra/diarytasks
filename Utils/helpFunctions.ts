import { CreateNoteProps } from "@/interfaces/NotesInterfaces";
import { CreateTaskProps } from "@/interfaces/TasksInterfaces";

// Generador de Id
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;


// Formateando fecha
const rawDate = "\"2025-01-25T21:13:16.895Z\""; // Fecha en formato recibido
const parsedDate = new Date(JSON.parse(rawDate)); // Parsear la cadena a un objeto Date

// Extraer día, mes y año
const day = String(parsedDate.getDate()).padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
const year = String(parsedDate.getFullYear()).slice(-4); // Obtener los últimos 2 dígitos del año

// Formatear la fecha
const formattedDate = `${day}-${month}-${year}`;

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