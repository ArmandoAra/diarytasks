import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import Note from '@/components/note/note';
import EditNoteScreen from '@/containers/editNote/editNote';
import CreateNote from '@/containers/editNote/createNote';
import { DeletingPopUp } from '@/components/delete/deletingPopUp';
import DayChangerContainer from '@/containers/dayChanger/dayChangerContainer';

import { getNotesByDate } from '@/db/noteDb';

import { useThemeContext } from '@/context/ThemeProvider';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useStatesContext } from '@/context/StatesProvider';

import { formatDateToString } from '@/Utils/helpFunctions';
import { Colors } from '@/constants/Colors';

interface NotesTabProps { } // Define props if needed

const NotesTab: React.FC<NotesTabProps> = () => {
  const { day, dayNotes, setDayNotes } = useGlobalContext();
  const { loading, setLoading, editNoteOpen, deletingOpen } = useStatesContext();
  const { theme } = useThemeContext();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getNotesByDate(day);
        setDayNotes(Array.isArray(notes.data) ? notes.data : []);
      } catch (error) {
        console.error("Error retrieving Notes:", error);
        setDayNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [day, setDayNotes]); // Add setDayNotes to dependency array


  const styles = createStyles(theme as "light" | "dark");

  return (
    <View style={styles.container}>
      {deletingOpen.isOpen && deletingOpen.type === "Note" && <DeletingPopUp />}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <Text style={styles.headerDate}>{formatDateToString(day)}</Text>
      </View>
      {editNoteOpen.isOpen && <EditNoteScreen />}
      <DayChangerContainer />
      <View style={styles.notesContainer}>
        <FlatList
          data={dayNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Note
              id={item.id}
              title={item.title}
              message={item.message}
              isFavorite={item.isFavorite}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={<CreateNote />}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.primary,
    },
    header: {
      height: 105,
      backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.background2,
      justifyContent: 'center', // Center content vertically
      alignItems: 'center',   // Center content horizontally
    },
    headerTitle: {
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
      fontFamily: "Pacifico",
      fontSize: 30,
      marginBottom: 5, // Add some space below the title
    },
    headerDate: {
      fontFamily: "Kavivanar",
      color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    notesContainer: {
      flex: 1, // Use flex:1 to take up remaining space
      backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background,

    },
    columnWrapper: {
      justifyContent: "space-around",
      paddingHorizontal: 10, // Add some horizontal padding to the columns
      paddingTop: 10,
    },
  });

export default NotesTab;