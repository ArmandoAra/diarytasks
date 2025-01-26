import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'

//Interface
export interface NoteProps {
    title: string;
    message: string;
    isFavorite: boolean;
    setIsFavorite: Dispatch<SetStateAction<boolean>>;
    onNoteEdit?: (event: GestureResponderEvent) => void;
    onNoteDelete?: (event: GestureResponderEvent) => void;
}

// Styles
import { styles } from './styles'
import Favorite from '../favoriteToggle/favToggle';


const Note = ({ title, message, isFavorite, setIsFavorite, onNoteEdit, onNoteDelete }: NoteProps) => {

    return (
        <View style={styles.note}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{title}</Text>
                <Favorite isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
            </View>
            <View>
                <Text style={styles.noteText} >{message}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onNoteEdit}>
                        <Text style={styles.actionText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNoteDelete}>
                        <Text style={styles.actionText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Note;

