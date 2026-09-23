import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { getFavoritesNotes, updateFavorite, getNotesByDate } from '@/db/noteDb';
import { Fontisto } from '@expo/vector-icons';
import Loader from '@/components/loader/loader';
import EmptyState from '@/components/emptyState/emptyState';
import LinedPaper from '@/components/linedPaper/linedPaper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
import { useGlobalContext } from '@/context/GlobalProvider';

const FavoritesTab = () => {
    const { loading, setLoading } = useStatesContext();
    const { theme } = useThemeContext();
    const { day, setDayNotes } = useGlobalContext();
    const insets = useSafeAreaInsets();

    const [favoritesNotes, setFavoritesNotes] = useState<CreateNoteProps[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchFavorites = async () => {
                setLoading(true);
                try {
                    const favoriteNotes = await getFavoritesNotes();
                    setFavoritesNotes(favoriteNotes.data ?? []);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavorites();
        }, [setLoading])
    );

    const handleFavoriteToggle = async (id: string) => {
        const removed = favoritesNotes.find(note => note.id === id);

        const result = await updateFavorite(id, 0);
        if (!result.success) {
            console.warn('Error toggling favorite');
            return;
        }

        setFavoritesNotes(notes => notes.filter(note => note.id !== id));

        // The note may also be on screen in the Notes tab for the selected day;
        // refresh that list so both views agree.
        if (removed?.date === day) {
            const notes = await getNotesByDate(day);
            setDayNotes(notes.data ?? []);
        }
    };

    const styles = createStyles(theme);
    const stylesSvg = createStylesSvg();

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Text style={styles.headerText}>Favorites</Text>
            </View>
            {loading ? (
                <Loader />
            ) : (
                <FlatList
                    data={favoritesNotes}
                    keyExtractor={(item) => String(item.id)}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <EmptyState
                            icon="heart-outline"
                            title="No favourite notes yet"
                            hint="Tap the heart on any note to keep it here."
                        />
                    }
                    renderItem={({ item: note }) => (
                        <View style={styles.noteContainer}>
                            <LinedPaper
                                backgroundColor={theme === "light" ? Colors.light.background2 : Colors.dark.primary}
                                spacing={26}
                            />
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => handleFavoriteToggle(note.id)}
                                accessibilityLabel="Remove from favourites"
                            >
                                <Fontisto name="heart" size={24} color="red" />
                            </TouchableOpacity>
                            {note.title ? <Text style={styles.noteTitle} numberOfLines={2}>{note.title}</Text> : null}
                            {note.message ? <Text style={styles.noteMessage}>{note.message}</Text> : null}
                            {note.date ? <Text style={styles.noteDate}>{note.date}</Text> : null}
                        </View>
                    )}
                />
            )}
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
            width: "100%",
            paddingBottom: 18,
            justifyContent: "flex-end",
        },
        headerText: {
            fontFamily: "Pacifico",
            fontSize: 30,
            textAlign: "center",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        list: {
            flex: 1,
            backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background,
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: 20,
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

const createStylesSvg = () =>
    StyleSheet.create({
        background: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
    });

export default FavoritesTab;