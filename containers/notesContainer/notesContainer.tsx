import { Link } from 'expo-router';
import React from 'react';
import { View, ScrollView } from 'react-native';


// Components
import Note from '../../components/note/note';

//Styles
import { useGlobalContext } from '@/context/GlobalProvider';
import { deleteNoteById, getNotesByDate } from '@/db/noteDb';
import { Colors } from '@/constants/Colors';



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
        <View style={{ height: "26%", paddingVertical: 3 }}>
            <ScrollView horizontal={true} style={{
                backgroundColor: Colors.light.background,
            }}>
                {dayNotes.map((note, index) => (
                    <View key={note.id} style={index === 0 ? { marginLeft: 150 } : {}}>
                        <Note
                            id={note.id}
                            title={note.title}
                            message={note.message}
                            isFavorite={note.isFavorite}
                            onNoteDelete={() => handleNoteDelete(note.id)}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default NotesContainer;


