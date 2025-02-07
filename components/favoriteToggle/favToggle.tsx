import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// db
import { getNotesByDate, updateFavorite } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';

// Icons
import Fontisto from '@expo/vector-icons/Fontisto';

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
                    <Fontisto name="heart" size={24} color="red" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => handleFavoriteToggle(1)}>
                    <Fontisto name="heart-alt" size={24} color="red" />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Favorite;
