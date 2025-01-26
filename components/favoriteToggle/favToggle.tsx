import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface IFavToggleProps {
    isFavorite: boolean;
    setIsFavorite: (value: boolean) => void;
}

const Favorite = ({ isFavorite, setIsFavorite }: IFavToggleProps) => {

    function toggleFavorite() {
        setIsFavorite(!isFavorite);
    }

    return (
        <View>
            {isFavorite ? (
                <TouchableOpacity onPress={toggleFavorite}>
                    <Text>🌟</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={toggleFavorite}>
                    <Text>☆</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Favorite;
