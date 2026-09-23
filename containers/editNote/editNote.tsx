import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { findNoteById } from '@/Utils/helpFunctions';
import { en, registerTranslation } from 'react-native-paper-dates';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getNotesByDate, updateNoteById } from '@/db/noteDb';
import { addMedia, deleteMedia, getMediaForNote } from '@/db/mediaDb';
import MediaStrip, { DraftMedia } from '@/components/media/mediaStrip';
import { deleteMediaFile } from '@/Utils/mediaStorage';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { AntDesign, FontAwesome, Fontisto } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import LinedPaper from '@/components/linedPaper/linedPaper';
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
  const [media, setMedia] = useState<DraftMedia[]>([]);

  useEffect(() => {
    const selectedNote = findNoteById(editNoteOpen.id, dayNotes);

    if (!selectedNote) {
      console.warn('Note not found:', editNoteOpen.id);
      setEditNoteOpen({ isOpen: false, id: "" });
      return;
    }

    setData({
      id: selectedNote.id,
      title: selectedNote.title,
      message: selectedNote.message,
      isFavorite: selectedNote.isFavorite,
      date: selectedNote.date,
    });
  }, [editNoteOpen.id, dayNotes, setEditNoteOpen]);

  useEffect(() => {
    if (!data.id) return;
    let cancelled = false;

    getMediaForNote(String(data.id)).then((result) => {
      if (!cancelled) setMedia(result.data ?? []);
    });

    return () => { cancelled = true; };
  }, [data.id]);

  const handleChanges = (key: keyof CreateNoteProps, value: string | number) => {
    setData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!data.message && media.length === 0) {
      return Alert.alert("Nothing to save", "Write something or attach a photo.");
    }

    const updated = await updateNoteById(data.id.toString(), data);
    if (!updated.success) {
      return Alert.alert("Could not save", "Something went wrong updating the note.");
    }

    // Attachments added during this edit have no row yet; existing ones do.
    for (const item of media) {
      if (!item.id) await addMedia({ ...item, noteId: String(data.id) });
    }

    const notes = await getNotesByDate(data.date);
    setDayNotes(notes.data ?? []);
    setEditNoteOpen({ isOpen: false, id: "" });
  };

  const styles = createStyles(theme);

  const handleRemoveMedia = async (index: number) => {
    const removed = media[index];
    setMedia((current) => current.filter((_, i) => i !== index));

    // Saved attachments go through the repository so their files are removed
    // too; unsaved ones only have files on disk.
    if (removed?.id) {
      await deleteMedia(removed.id);
    } else {
      await deleteMediaFile(removed?.path);
      await deleteMediaFile(removed?.thumbPath);
    }
  };

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
          <LinedPaper backgroundColor={theme === "light" ? Colors.light.background2 : Colors.dark.ternary} />

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
          <MediaStrip
            media={media}
            onAdd={(picked) => setMedia((current) => [...current, ...picked])}
            onRemove={handleRemoveMedia}
          />
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        {(data.message || media.length > 0) ? (
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <AntDesign name="pluscircle" size={50} color={Colors.text.textLight} />
          </TouchableOpacity>
        ) : null}
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


export default EditNoteScreen;
