import { Link, router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Components
import Note from '../../components/note/note';

//Styles
import { styles } from './styles';


const NotesContainer = () => {
    const [isFavorite, setIsFavorite] = React.useState(false);


    //TODO: Crear use effect para el favorito que cuando cambie entonces guarde el cambio permanente

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
                {/* Nota 1 title="Task 1"  text="Complete the project by Friday." */}
                <Note
                    title="Task 2"
                    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                    onNoteEdit={() => console.log("To Note Edit")}
                    onNoteDelete={() => console.log("To Note Delete")}
                />

            </View>
        </View>
    );
};



export default NotesContainer;
