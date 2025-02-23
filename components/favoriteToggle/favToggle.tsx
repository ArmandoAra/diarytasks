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
        const dayNotesWidthFavoriteChanged = dayNotes.map(note =>
            note.id === id ? { ...note, isFavorite: (note.isFavorite == 0) ? 1 : 0 } : note
        );
        setDayNotes(dayNotesWidthFavoriteChanged)
        const result = await updateFavorite(id, fav);

        if (!result) {
            console.log("Something went wrong updating favorite note")
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
