import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { handleUrlParams } from 'expo-router/build/fork/getStateFromPath-forks';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// db
import { getNotesByDate, updateFavorite } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';

interface IFavToggleProps {
    id: string;
    isFavorite: number;
}

const Favorite = ({ id, isFavorite }: IFavToggleProps) => {
    const { setLoading, day, setDayNotes } = useGlobalContext();
    const [favError, setFavError] = useState("");

    const handleFavoriteToggle = (fav: number) => {
        setLoading(true)
        updateFavorite(id, fav)
        const fetchNotesDay = async () => {
            const response = await getNotesByDate(day);
            if (response.success && response.data) {
                setDayNotes(response.data);
            } else {
                setFavError('An error occurred while fetching notes.');
            }
        };

        fetchNotesDay();
        setLoading(false)
    }

    return (
        <View>
            {isFavorite === 1 ? (
                <TouchableOpacity onPress={() => handleFavoriteToggle(0)}>
                    <Text>🌟</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => handleFavoriteToggle(1)}>
                    <Text>☆</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Favorite;
