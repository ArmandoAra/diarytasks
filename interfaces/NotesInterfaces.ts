
export interface CreateNoteProps {
    id: string;
    title: string;
    message: string;
    isFavorite: number;
    date: string;
}

export interface NoteProps {
    id: string,
    title: string;
    message: string;
    isFavorite: number;
}