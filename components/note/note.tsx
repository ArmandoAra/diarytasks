import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'



//Interface
export interface NoteProps {
    id: string,
    title: string;
    message: string;
    isFavorite: number;
    onNoteDelete?: (event: GestureResponderEvent) => void;
}

// Styles
import { styles } from './styles'
import Favorite from '../favoriteToggle/favToggle';
import { Link } from 'expo-router';


const Note = ({ id, title, message, isFavorite, onNoteDelete }: NoteProps) => {

    return (
        <View style={styles.note}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{title}</Text>
                <Favorite isFavorite={isFavorite} id={id} />
            </View>
            <View>
                <Text style={styles.noteText} >{message}</Text>
                <View style={styles.actions}>
                    <Link
                        href={{
                            pathname: '/editNote/[id]',
                            params: { id }
                        }}

                    >
                        ✏️
                    </Link>
                    <TouchableOpacity onPress={onNoteDelete}>
                        <Text style={styles.actionText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Note;

