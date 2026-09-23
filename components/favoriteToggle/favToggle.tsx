import React, { } from 'react'
import { TouchableOpacity, View } from 'react-native'

// db
import { updateFavorite } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';

// Icons
import Fontisto from '@expo/vector-icons/Fontisto';

interface IFavToggleProps {
    id: string;
    isFavorite: number;
}

const Favorite = ({ id, isFavorite }: IFavToggleProps) => {
    const { setDayNotes, dayNotes } = useGlobalContext();

    const handleFavoriteToggle = async (fav: number) => {
        // Optimistic update so the heart reacts instantly.
        setDayNotes(notes =>
            notes.map(note => (note.id === id ? { ...note, isFavorite: fav } : note))
        );

        const result = await updateFavorite(id, fav);

        if (!result.success) {
            console.warn('Something went wrong updating favorite note');
            // Put the previous value back so the UI matches the database.
            setDayNotes(notes =>
                notes.map(note => (note.id === id ? { ...note, isFavorite } : note))
            );
        }
    };

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
