import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Pressable,
    ScrollView,
} from 'react-native';


// Styles
// import styles from '../../../styles/editTaskStyles';

// Utils

// Date Picker
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { createNote } from '@/db/noteDb';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import Svg, { Line } from 'react-native-svg';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
registerTranslation('en', en)





const CreateNote = () => {
    const { day } = useGlobalContext();
    const { setCreateNoteOpen, createNoteOpen, setLoading } = useStatesContext();
    const { theme } = useThemeContext();
    const initialData = {
        id: "",
        title: '',
        message: '',
        isFavorite: 0,
        date: day,
    }
    const [note, setNote] = useState<CreateNoteProps>(initialData);
    const messageInputRef = useRef<TextInput>(null); // Referencia al TextInput

    const handleChanges = (key: keyof CreateNoteProps, value: string | Date) => {
        setNote(prevData => {
            if (prevData[key] === value) return prevData;
            return { ...prevData, [key]: value };
        });
    };

    useEffect(() => {
        setNote((prevData) => ({
            ...prevData,
            date: day,
        }))
    }, [day])

    const handleSubmit = () => {
        if (!note.message) return Alert.alert("Message is required", "Please enter a message for the note.");
        setLoading(true);
        createNote(note)
            .then(() => {
                setNote(initialData)
                setCreateNoteOpen(false)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleNote = () => {
        if (note.message == "" && createNoteOpen) return setCreateNoteOpen(false);
        if (!createNoteOpen) {
            setCreateNoteOpen(true);
            setTimeout(() => {
                messageInputRef.current?.focus(); // Asegurar que el input se enfoca después de renderizarse
            }, 100);
        } else {
            handleSubmit();
            setCreateNoteOpen(false)
        }
    }

    const CloseNote = () => {
        if (createNoteOpen) {
            setNote(initialData)
            setCreateNoteOpen(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {createNoteOpen &&
                <View
                    style={{
                        backgroundColor: theme == "light" ? Colors.light.secondary2 : Colors.dark.primary2,
                        borderRadius: 16,
                        width: "80%",
                        marginHorizontal: "auto",
                        marginBottom: 60,
                        overflow: "hidden",
                    }}>
                    {/*  botón de favorito */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            right: 20,
                            top: 20,
                            zIndex: 10
                        }}>
                        <TouchableOpacity onPress={() => handleChanges("isFavorite", note.isFavorite == 1 ? "0" : "1")}>
                            {note.isFavorite == 0 ? (
                                <Fontisto name="heart-alt" size={24} color="red" />
                            ) : (
                                <Fontisto name="heart" size={24} color="red" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Fondo estilo libreta */}
                    <View
                        style={[
                            stylesSvg.background,
                            {
                                backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.ternary
                            }]}>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <Svg key={i} height="24" width="100%">
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

                    <TextInput
                        style={{
                            ...styles.input,
                            width: "50%",
                            paddingLeft: 15,
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}
                        value={note.title}
                        onChangeText={(value) => handleChanges("title", value)}
                        placeholder="Enter note title"
                    />
                    <TextInput
                        ref={messageInputRef}

                        style={{
                            ...styles.input,
                            height: 150,
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            marginBottom: 10,
                            lineHeight: 23.4,
                            width: "85%",
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}
                        value={note.message}
                        onChangeText={(value) => handleChanges("message", value)}
                        placeholder="Enter message description"
                        numberOfLines={5}
                        multiline
                        textAlignVertical="top"
                    />

                </View>}

            {/* Botón de acción flotante */}
            <View
                style={{
                    flexDirection: createNoteOpen ? "column" : "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: createNoteOpen ? "absolute" : "relative",
                    right: 35,
                    marginBottom: createNoteOpen ? 50 : 30,
                    bottom: createNoteOpen ? 5 : 0,
                    zIndex: 10,
                }}>
                <TouchableOpacity
                    onPress={() => handleNote()}
                    style={{ margin: 10 }}
                >
                    {/* Icono de plus */}
                    <AntDesign name="pluscircle" size={50} color={theme == "light" ? Colors.light.secondary : Colors.dark.secondary2} />
                </TouchableOpacity>
                {createNoteOpen &&
                    <TouchableOpacity
                        onPress={() => CloseNote()}
                        style={{ margin: 10, }}
                    >
                        <AntDesign name="minuscircle" size={50} color={theme == "light" ? Colors.light.primary : Colors.dark.background} />
                    </TouchableOpacity>}
            </View>


        </View>

    );
};

const styles = StyleSheet.create({
    input: {
        alignContent: 'flex-start',
        fontSize: 16,
        fontFamily: 'Kavivanar',
    },
});

const stylesSvg = StyleSheet.create({
    container: {
        // backgroundColor: '#FFFDE7',
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

export default CreateNote;
