import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { getFavoritesNotes, updateFavorite, getNotesByDate } from '@/db/noteDb';
import Svg, { Line } from 'react-native-svg';
import { Fontisto } from '@expo/vector-icons';
import Loader from '@/components/loader/loader';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
import { useGlobalContext } from '@/context/GlobalProvider';

const FavoritesTab = () => {
    const { loading, setLoading } = useStatesContext();
    const { theme } = useThemeContext();
    const { day, dayNotes, setDayNotes } = useGlobalContext();

    const [favoritesNotes, setFavoritesNotes] = useState<CreateNoteProps[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchFavorites = async () => {
                try {
                    const favoriteNotes = await getFavoritesNotes();
                    setFavoritesNotes(favoriteNotes.data as CreateNoteProps[]);
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            };
            fetchFavorites();
            setLoading(false);
        }, [favoritesNotes.length])
    );

    const handleFavoriteToggle = async (id: string) => {

        try {
            await updateFavorite(id, 0);
            setFavoritesNotes(favoritesNotes.filter(note => note.id !== id));

            let variab = favoritesNotes.map(note => {
                if (note.id === id) {
                    return note.date;
                }
            })

            if (variab.includes(day)) {
                let result = await getNotesByDate(day);
                if (result) setDayNotes(result.data as CreateNoteProps[])
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
        setLoading(false);

    };

    const styles = createStyles(theme as "light" | "dark");
    const stylesSvg = createStylesSvg(theme as "light" | "dark");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Favorites</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {!loading ? (
                    favoritesNotes.map((note) => (
                        <View key={note.id} style={styles.noteContainer}>
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
                            <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavoriteToggle(note.id)}>
                                <Fontisto name="heart" size={24} color="red" />
                            </TouchableOpacity>
                            {note.title && <Text style={styles.noteTitle}>{note.title}</Text>}
                            {note.message && <Text style={styles.noteMessage}>{note.message}</Text>}
                            {note.date && <Text style={styles.noteDate}>{note.date}</Text>}
                        </View>
                    ))
                ) : (
                    <Loader />
                )}
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background,
        },
        header: {
            backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.background2,
            height: 105,
            width: "100%",
            justifyContent: "center",
            position: "absolute",
        },
        headerText: {
            fontFamily: "Pacifico",
            fontSize: 30,
            textAlign: "center",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        scrollView: {
            marginTop: 105,
            backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background,
        },
        noteContainer: {
            overflow: 'hidden',
            width: '90%',
            borderRadius: 19,
            marginTop: 10,
            alignSelf: "center",
            backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.primary,
            padding: 15,
            position: "relative",
        },
        favoriteButton: {
            position: "absolute",
            right: 20,
            top: 15,
            zIndex: 2,
        },
        noteTitle: {
            fontFamily: "Kavivanar",
            fontSize: 18,
            paddingHorizontal: 15,
            paddingTop: 20,
        },
        noteMessage: {
            fontFamily: "Kavivanar",
            fontSize: 16,
            paddingHorizontal: 15,
            lineHeight: 25,
        },
        noteDate: {
            width: "100%",
            fontFamily: "Kavivanar",
            textAlign: "right",
            fontSize: 12,
            paddingRight: 20,
        },
    });

const createStylesSvg = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        background: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
    });

export default FavoritesTab;