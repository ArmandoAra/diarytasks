
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
