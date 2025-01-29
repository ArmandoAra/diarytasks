import { Link } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

// Components
import Note from '../../components/note/note';

//Styles
import { styles } from './styles';
import { useGlobalContext } from '@/context/GlobalProvider';
import { deleteNoteById, getNotesByDate } from '@/db/noteDb';


const NotesContainer = () => {
    const { day, dayNotes, setDayNotes } = useGlobalContext();
    // const [isFavorite, setIsFavorite] = React.useState(false);
    const [notesError, setNotesError] = React.useState<string>('');

    const handleNoteDelete = (id: string) => {
        deleteNoteById(id)
        const fetchNotesDay = async () => {
            const response = await getNotesByDate(day);
            if (response.success && response.data) {
                setDayNotes(response.data);
            } else {
                setNotesError(response.message || 'An error occurred while fetching notes.');
            }
        };
        fetchNotesDay();
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Daily Notes</Text>
                <Link style={styles.addButton}
                    href={'/createNote'}
                    asChild
                    accessibilityLabel="Create New Note">
                    <Text style={styles.addButtonText}>+</Text>
                </Link>
            </View>
            {/* Contenedor de Notas */}
            <View style={styles.notesContainer}>
                {dayNotes.map(note => (
                    <Note
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        message={note.message}
                        isFavorite={note.isFavorite}
                        onNoteDelete={() => handleNoteDelete(note.id)}
                    />
                ))}
            </View>
        </View>
    );
};

export default NotesContainer;
