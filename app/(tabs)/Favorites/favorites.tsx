import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    Button,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

//interfaces
import { Colors } from '@/constants/Colors';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { getFavoritesNotes, updateFavorite } from '@/db/noteDb';
import Svg, { Line } from 'react-native-svg';
import { Fontisto } from '@expo/vector-icons';
import Loader from '@/components/loader/loader';
import { useStatesContext } from '@/context/StatesProvider';



const fetchFavoritesNotes = async (setFavoritesNotes: React.Dispatch<React.SetStateAction<CreateNoteProps[]>>) => {
    const response = await getFavoritesNotes();
    if (response.success && response.data) {
        setFavoritesNotes(response.data);
    } else {
        console.log(response.message || 'An error occurred while fetching tasks.');
    }
};

const FavoritesTab = () => {
    const { loading, setLoading } = useStatesContext();

    const [favoritesNotes, setFavoritesNotes] = useState<CreateNoteProps[]>([]);

    useFocusEffect(
        useCallback(() => {
            getFavoritesNotes().then((favoriteNotes) => {
                setFavoritesNotes(favoriteNotes.data as CreateNoteProps[]);
            })
        }, [])
    );

    const handleFavoriteToggle = async (id: string) => {
        setLoading(true)
        updateFavorite(id, 0).then(() => {
            const newFavoritesNotes = favoritesNotes.filter(note => note.id !== id);
            setFavoritesNotes(newFavoritesNotes);
            setLoading(false);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            <View style={{
                flex: 1,
                backgroundColor: Colors.light.secondary,
                height: 100,
                width: "100%",
                justifyContent: "center",
                position: "absolute"
            }}>
                <Text style={{ color: "black", marginTop: 0, fontFamily: "Pacifico", fontSize: 30, textAlign: "center", }}>Favorites</Text>
            </View>
            <ScrollView style={{ marginTop: 100 }}>
                {!loading ?
                    favoritesNotes.map((note, index) => (
                        <View style={styles.container} key={index}>
                            <View style={stylesSvg.background}>
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <Svg key={i} height="26" width="100%">
                                        <Line
                                            x1="0"
                                            y1="19"
                                            x2="100%"
                                            y2="20"
                                            stroke="rgba(8, 8, 9, 0.1)"
                                            strokeWidth="1"
                                        />
                                    </Svg>
                                ))}
                            </View>

                            <TouchableOpacity style={{ position: "absolute", right: 20, top: 15, zIndex: 2 }} onPress={() => handleFavoriteToggle(note.id)}>
                                <Fontisto name="heart" size={24} color="red" />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: "Kavivanar",
                                    fontSize: 18,
                                    paddingHorizontal: 15,
                                    paddingTop: 20,
                                }}>
                                {note.title}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: "Kavivanar",
                                    fontSize: 16,
                                    paddingHorizontal: 15,
                                    lineHeight: 25,
                                }}

                            >{note.message}</Text>
                            <Text style={{ width: "100%", fontFamily: "Kavivanar", textAlign: "right", fontSize: 12, paddingRight: 20 }}>{note.date}</Text>
                        </View>
                    ))
                    : <Loader />
                }
            </ScrollView>

        </View >
    );
};

export default FavoritesTab;


const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        width: '90%',
        borderRadius: 19,
        marginTop: 20,
        marginHorizontal: 'auto',
        backgroundColor: Colors.light.primaryDark,
        elevation: 5,
    },
    label: {
        height: 70,
        fontSize: 30,
        fontFamily: 'Pacifico',
        textAlign: 'right',
        textAlignVertical: 'center',
    },
});

const stylesSvg = StyleSheet.create({
    container: {
        backgroundColor: '#FFFDE7',
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    background: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

