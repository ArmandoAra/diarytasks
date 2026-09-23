import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { en, registerTranslation } from 'react-native-paper-dates';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createNote, getNotesByDate } from '@/db/noteDb';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import LinedPaper from '@/components/linedPaper/linedPaper';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

registerTranslation('en', en);

interface CreateNotePropsInterface { }

const CreateNote: React.FC<CreateNotePropsInterface> = () => {
    const { day, setDayNotes } = useGlobalContext();
    const { setCreateNoteOpen, createNoteOpen, } = useStatesContext();
    const { theme } = useThemeContext();

    const initialData: CreateNoteProps = {
        id: "",
        title: '',
        message: '',
        isFavorite: 0,
        date: day,
    };

    const [note, setNote] = useState<CreateNoteProps>(initialData);
    const messageInputRef = useRef<TextInput>(null);

    useEffect(() => {
        setNote((prevData) => ({ ...prevData, date: day }));
    }, [day]);

    const handleChanges = (key: keyof CreateNoteProps, value: string | number) => {
        setNote(prevData => ({ ...prevData, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!note.message) {
            return Alert.alert("Message is required", "Please enter a message for the note.");
        }
        const created = await createNote(note);
        if (!created.success) {
            return Alert.alert("Could not save", "Something went wrong creating the note.");
        }

        const notes = await getNotesByDate(day);
        setDayNotes(notes.data ?? []);
        setNote(initialData);
        setCreateNoteOpen(false);
    };

    const handleCreateNotePress = () => {
        if (note.message === "" && createNoteOpen) {
            return setCreateNoteOpen(false);
        }

        if (!createNoteOpen) {
            setCreateNoteOpen(true);
            setTimeout(() => {
                messageInputRef.current?.focus();
            }, 100);
        } else {
            handleSubmit();
        }
    };

    const closeNote = () => {
        if (createNoteOpen) {
            setNote(initialData);
            setCreateNoteOpen(false);
        }
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {createNoteOpen && (
                <View style={styles.noteCard}>
                    <View style={styles.favoriteButtonContainer}>
                        <TouchableOpacity onPress={() => handleChanges("isFavorite", note.isFavorite === 1 ? 0 : 1)}>
                            <Fontisto name={note.isFavorite === 0 ? "heart-alt" : "heart"} size={24} color="red" />
                        </TouchableOpacity>
                    </View>


          <LinedPaper backgroundColor={theme === "light" ? Colors.light.background2 : Colors.dark.ternary} />

                    <TextInput
                        style={styles.titleInput}
                        value={note.title}
                        onChangeText={(value) => handleChanges("title", value)}
                        placeholder="Enter note title"
                        placeholderTextColor={theme === "light" ? Colors.text.textDark : Colors.text.textLight}
                    />
                    <TextInput
                        ref={messageInputRef}
                        style={styles.messageInput}
                        value={note.message}
                        onChangeText={(value) => handleChanges("message", value)}
                        placeholder="Enter message description"
                        placeholderTextColor={theme === "light" ? Colors.text.textDark : Colors.text.textLight}
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            )}

            <View style={styles.actionButtonContainer}>
                <TouchableOpacity onPress={handleCreateNotePress} style={styles.addButton}>
                    <AntDesign name="pluscircle" size={50} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                </TouchableOpacity>
                {createNoteOpen && (
                    <TouchableOpacity onPress={closeNote} style={styles.closeButton}>
                        <AntDesign name="minuscircle" size={50} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: 120,

        },
        noteCard: {
            backgroundColor: theme === "light" ? Colors.light.secondary2 : Colors.dark.primary2,
            marginTop: 20,
            borderRadius: 16,
            width: "86%",
            marginHorizontal: "auto",
            marginBottom: 20,
            overflow: "hidden",
        },
        favoriteButtonContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            right: 20,
            top: 20,
            zIndex: 10,
        },
        notebook: {
            // No specific styles needed, ScrollView handles scrolling
        },
        titleInput: {
            alignContent: 'flex-start',
            fontSize: 16,
            fontFamily: 'Kavivanar',
            width: "50%",
            paddingLeft: 15,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        messageInput: {
            alignContent: 'flex-start',
            fontSize: 16,
            fontFamily: 'Kavivanar',
            height: 150,
            paddingVertical: 10,
            paddingHorizontal: 15,
            marginBottom: 10,
            lineHeight: 23.4,
            width: "85%",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        actionButtonContainer: {
            flexDirection: "row", // Changed to row
            justifyContent: "flex-end",
            alignItems: "flex-end",
            position: "relative", // Changed to relative
            right: 35,
            marginBottom: 30,
            bottom: 0,
            zIndex: 10,
        },

        addButton: {
            margin: 10,
        },
        addIconColor: {
            color: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        },
        closeButton: {
            margin: 10,
        },
        closeIconColor: {
            color: theme === "light" ? Colors.light.primary : Colors.dark.background,
        },
        input: {
            fontSize: 16,
            fontFamily: 'Kavivanar',
        },
    });


export default CreateNote;