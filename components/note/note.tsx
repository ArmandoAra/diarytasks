import React from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'

//Interface
export interface NoteProps {
    title: string;
    description: string[];
    isImportant?: boolean;
    toggleNoteImportance?: (event: GestureResponderEvent) => void;
    onNoteEdit?: (event: GestureResponderEvent) => void;
    onNoteDelete?: (event: GestureResponderEvent) => void;
}

// Styles
import { styles } from './styles'



const Note = ({ title, description, isImportant, toggleNoteImportance, onNoteEdit, onNoteDelete }: NoteProps) => {

    return (
        <View style={styles.note}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{title}</Text>

                <TouchableOpacity onPress={toggleNoteImportance} >
                    <Text style={styles.noteStar}>{isImportant ? '⭐' : '🌟'}</Text>
                </TouchableOpacity>

            </View>
            <View>
                {description?.map((text: string, index: number) => {
                    return (<Text style={styles.noteText} key={index}>{text}</Text>)
                })}
            </View>
            <View style={styles.actions}>

                <TouchableOpacity onPress={onNoteEdit}>
                    <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNoteDelete}>
                    <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Note
