import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { searchNoteById } from '@/Utils/helpFunctions';
import { en, registerTranslation } from 'react-native-paper-dates';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getNotesByDate, updateNoteById } from '@/db/noteDb';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { AntDesign, FontAwesome, Fontisto } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import Svg, { Line } from 'react-native-svg';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

registerTranslation('en', en);

interface EditNoteScreenProps { }

const EditNoteScreen: React.FC<EditNoteScreenProps> = () => {
  const { dayNotes, setDayNotes } = useGlobalContext();
  const { setEditNoteOpen, editNoteOpen } = useStatesContext();
  const { theme } = useThemeContext();

  const initialData: CreateNoteProps = {
    id: "",
    title: '',
    message: '',
    isFavorite: 0,
    date: '',
  };

  const [data, setData] = useState<CreateNoteProps>(initialData);

  useEffect(() => {
    const selectedNote = searchNoteById(editNoteOpen.id, dayNotes);
    if (selectedNote && selectedNote.length > 0) {
      setData((prevData) => ({
        ...prevData,
        title: selectedNote[0].title,
        message: selectedNote[0].message,
        isFavorite: selectedNote[0].isFavorite,
        date: selectedNote[0].date,
        id: selectedNote[0].id, // Include the ID
      }));
    } else {
      console.warn("Note not found!");
      setData(initialData);
    }
  }, [editNoteOpen.id, dayNotes]);

  const handleChanges = (key: keyof CreateNoteProps, value: string | number) => {
    setData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!data.message) {
      return Alert.alert("Message is required", "Please enter a message for the note.");
    }

    try {
      await updateNoteById(data.id.toString(), data); // Use data.id
      const notes = await getNotesByDate(data.date);
      setDayNotes(notes.data as CreateNoteProps[]);
      setEditNoteOpen({ isOpen: false, id: "" });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const styles = createStyles(theme as "light" | "dark");
  const stylesSvg = createStylesSvg();

  const handleFavoritePress = () => {
    handleChanges("isFavorite", data.isFavorite === 0 ? 1 : 0);
  };


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Note</Text>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Fontisto name={data.isFavorite === 0 ? "heart-alt" : "heart"} size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditNoteOpen({ isOpen: false, id: "" })}
            style={styles.closeButton}
          >
            <FontAwesome name="close" size={34} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.notebook}>
          <View style={stylesSvg.background}>
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
            style={styles.titleInput}
            value={data.title}
            onChangeText={(value) => handleChanges("title", value)}
            placeholder="Enter note title"
          />
          <TextInput
            style={styles.messageInput}
            value={data.message}
            onChangeText={(value) => handleChanges("message", value)}
            placeholder="Enter message description"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        {data.message && (
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <AntDesign name="pluscircle" size={50} color={Colors.text.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
      top: 105,
      position: 'absolute',
      backgroundColor: theme === "light" ? Colors.light.secondary2 : Colors.dark.background2,
      zIndex: 100,
    },
    content: {
      backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.primary2,
      width: "90%",
      marginHorizontal: "5%",
      padding: 10,
      borderRadius: 16,
      gap: 10,
      marginTop: 15,
    },
    header: {
      flexDirection: "row",
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    headerTitle: {
      height: 70,
      fontSize: 30,
      fontFamily: 'Pacifico',
      textAlign: 'right',
      textAlignVertical: 'center',
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    closeButton: {
      backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.secondary2,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      elevation: 5,
    },
    closeIconColor: {
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    notebook: {
      overflow: "hidden", // Changed to hidden to prevent scrollbar
      borderRadius: 16,
      backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.ternary,
    },
    titleInput: {
      fontSize: 16,
      fontFamily: 'Kavivanar',
      padding: 15,
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    messageInput: {
      fontSize: 16,
      fontFamily: 'Kavivanar',
      height: 150,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
      lineHeight: 23.4,
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    actionButtonContainer: {
      width: "100%",
      flexDirection: "row",
      height: 60,
      justifyContent: "flex-end",
      paddingTop: 10,
      paddingRight: 20,
    },
    saveButton: {
      right: 0,
      position: "relative",
    },
    saveIconColor: {
      color: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
    },
  });

const createStylesSvg = () =>
  StyleSheet.create({
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

export default EditNoteScreen;
