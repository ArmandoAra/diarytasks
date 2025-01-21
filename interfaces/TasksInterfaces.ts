import { GestureResponderEvent } from "react-native";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type Status = "ToDo" | "Completed";
export type ImportanceLevel = "Low" | "Medium" | "High";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: Status;
    importanceLevel: ImportanceLevel;
    weekDays?: WeekDay[];
    dates?: Date[];
    dateStart?: Date;
    dateEnd?: Date;
    createdAt: Date;
    modifiedAt: Date;

    onTaskEdit?: (event: GestureResponderEvent) => void;
    onTaskDelete?: (event: GestureResponderEvent) => void;
}