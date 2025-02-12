import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';


// Components
import Note from '../../components/note/note';

//Styles
import { useGlobalContext } from '@/context/GlobalProvider';
import { deleteNoteById, getNotesByDate } from '@/db/noteDb';
import { Colors } from '@/constants/Colors';



const NotesContainer = () => {
    const { day, dayNotes, setDayNotes, loading, setLoading } = useGlobalContext();
    const [notesError, setNotesError] = useState<string>('');
    const [noteToDelete, setNoteToDelete] = useState<string>('');


    const handleNoteDelete = (id: string) => {
        deleteNoteById(id)
        const fetchNotesDay = async () => {
            setLoading(true);
            const response = await getNotesByDate(day);
            if (response.success && response.data) {
                setDayNotes(response.data);
                setLoading(false);
            } else {
                setNotesError(response.message || 'An error occurred while fetching notes.');
                setLoading(false);
            }
        };
        fetchNotesDay();
        setNoteToDelete('');
    }


    return (<>
        {(noteToDelete !== '') && (
            <View style={{
                height: "26%",
                paddingVertical: 3,
                width: "90%",
                position: "absolute",
                top: 250,
                left: 20,
                gap: 10,
                padding: 10,
                borderRadius: 16,
                backgroundColor: Colors.light.background2,
            }}>
                {/* Los textos deben estar dentro de <Text> */}
                <Text style={{ fontFamily: "Kavivanar", fontSize: 30, textAlign: "center", color: Colors.light.primaryLight }}>Deleting...</Text>
                <Text style={{ fontFamily: "Kavivanar", fontSize: 15, textAlign: "center", color: Colors.light.primaryLight }}>Do you really want to delete this Note?</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around", height: 50, alignItems: "center" }}>
                    <TouchableOpacity style={{ width: 90, height: 40, backgroundColor: Colors.light.secondary, borderRadius: 16 }} onPress={() => setNoteToDelete('')}>
                        <Text style={{ fontFamily: "Cagliostro", textAlign: "center", marginVertical: "auto", fontSize: 20 }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 90, height: 40, backgroundColor: Colors.light.primary, borderRadius: 16 }} onPress={() => handleNoteDelete(noteToDelete)}>
                        <Text style={{ fontFamily: "Cagliostro", textAlign: "center", marginVertical: "auto", fontSize: 20 }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

        <View style={{ height: "26%", paddingVertical: 3 }}>
            <ScrollView horizontal={true} style={{
                backgroundColor: Colors.light.background,
            }}>
                {dayNotes && dayNotes.map((note, index) => (
                    <View key={note.id} style={index === 0 ? { marginLeft: 10 } : {}}>
                        <Note
                            id={note.id}
                            title={note.title}
                            message={note.message}
                            isFavorite={note.isFavorite}
                            onNoteDelete={() => setNoteToDelete(note.id)}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>

    </>
    );
};

export default NotesContainer;


