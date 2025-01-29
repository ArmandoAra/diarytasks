
export type Status = "ToDo" | "Completed";
export type SortOption = "ToDo" | "Completed" | "All";
export type ImportanceLevel = "Low" | "Medium" | "High";

export interface CreateTaskProps {
    id: string,
    title: string;
    description: string;
    status: Status;
    priority: ImportanceLevel;
    date: string;
}

export interface CreateTaskTemplateProps {
    title: string;
    description: string;
}
