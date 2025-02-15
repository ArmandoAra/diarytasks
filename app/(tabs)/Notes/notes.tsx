import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

// Components

// Styles
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { createNote, deleteNoteById, getNotesByDate, updateFavorite } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Svg, { Line } from 'react-native-svg';
import { useNavigation, useTheme } from '@react-navigation/native';
import { BottomTabNavProps } from '@/interfaces/types';
import { useStatesContext } from '@/context/StatesProvider';
import Loader from '@/components/loader/loader';
import Note from '@/components/note/note';
import { useThemeContext } from '@/context/ThemeProvider';
import EditNoteScreen from '@/containers/editNote/editNote';
import CreateNote from '@/containers/editNote/createNote';
import { DeletingPopUp } from '@/components/delete/deletingPopUp';
import DayChangerContainer from '@/containers/dayChanger/dayChangerContainer';
import { formatDateToString } from '@/Utils/helpFunctions';

const initialNoteData = (day: string): CreateNoteProps => {
  return {
    id: '',
    title: '',
    message: '',
    isFavorite: 0,
    date: day,
  }
}


const NotesTab = () => {
  const { day, dayNotes, setDayNotes } = useGlobalContext();
  const { loading, setLoading, editNoteOpen, createNoteOpen, deletingOpen } = useStatesContext();
  const { theme } = useThemeContext();
  const [note, setNote] = useState<CreateNoteProps>(initialNoteData(day));
  const navigation = useNavigation<BottomTabNavProps>();
  const [favoritesNotes, setFavoritesNotes] = useState<CreateNoteProps[]>([]);

  const [notesError, setNotesError] = useState<string>('');
  const [noteToDelete, setNoteToDelete] = useState<string>('');

  useEffect(() => {
    getNotesByDate(day)
      .then((notes) => {
        setDayNotes(Array.isArray(notes.data) ? notes.data : []);
      })
      .catch((error) => {
        console.error("Error retrieving Notes:", error);
        setDayNotes([]);
      });

  }, [day, loading]);


  const handleNoteDelete = (id: string) => {
    deleteNoteById(id)
    const fetchNotesDay = async () => {
      setLoading(true);
      const response = await getNotesByDate(day);
      if (response.success && response.data) {
        setDayNotes(response.data);
        setLoading(false);
      } else {
        setNotesError(response.message || 'An error occurred while fetching notes.');
        setLoading(false);
      }
    };
    fetchNotesDay();
    setNoteToDelete('');
  }

  const handleChanges = (key: keyof CreateNoteProps, value: string | boolean | number) => {
    setNote((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };


  const handleFavoriteToggle = async (id: string) => {
    updateFavorite(id, 0).then(() => {
      const newFavoritesNotes = favoritesNotes.filter(note => note.id !== id);
      setFavoritesNotes(newFavoritesNotes);
    });
  }


  return (
    <View style={{ flex: 1, backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.primary }}>
      {/* On Note Deleting */}
      {(deletingOpen.isOpen && deletingOpen.type == "Note") && <DeletingPopUp />}

      {/* Header */}
      <View style={{ height: 130, backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.primary2 }}>
        <Text style={{
          textAlignVertical: "center",
          color: "black",
          marginTop: 0,
          fontFamily: "Pacifico",
          fontSize: 30,
          textAlign: "center",
        }}>Notes </Text>
        <Text style={{ fontFamily: "Kavivanar", textAlign: "center", marginVertical: 2, }}>{formatDateToString(day)}</Text>
        <DayChangerContainer />
      </View>


      <View style={{ height: "85%" }}>
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
          columnWrapperStyle={{ justifyContent: "space-around" }}
          contentContainerStyle={{ backgroundColor: Colors.light.background }}
          ListFooterComponent={<CreateNote />} // Agrega el componente al final
        />

        {/* Pop Up to Edit Note */}
        {editNoteOpen.isOpen && <EditNoteScreen />}
      </View>

    </View >

  );
};


export default NotesTab;
