import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Components
import Note from '../../components/note/note';

//Styles
import { styles } from './styles';


const NotesContainer = () => {

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Daily Notes</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("./createNote")}
                    accessibilityLabel="Create New Note">
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Contenedor de Notas */}
            <View style={styles.notesContainer}>
                {/* Nota 1 title="Task 1"  text="Complete the project by Friday." */}
                <Note
                    title="Task 2"
                    description={["Finish the report by Monday.", "Review the feedback from your team.", "Submit the final project.", "Review the project plan."]}
                    onNoteEdit={() => console.log("To Note Edit")}
                    onNoteDelete={() => console.log("To Note Delete")}
                    toggleNoteImportance={() => console.log("To Toggle Importance")}
                />





            </View>
        </View>
    );
};



export default NotesContainer;
