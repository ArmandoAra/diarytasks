import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';

// Components
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

const NotesTab = () => {
  const { day, dayNotes, setDayNotes } = useGlobalContext();
  const { loading, setLoading, editNoteOpen, deletingOpen } = useStatesContext();
  const { theme } = useThemeContext();

  useEffect(() => {
    getNotesByDate(day)
      .then((notes) => {
        setDayNotes(Array.isArray(notes.data) ? notes.data : []);
      })
      .catch((error) => {
        console.error("Error retrieving Notes:", error);
        setDayNotes([]);
      });

    setLoading(false);

  }, [day, loading]);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.primary,

      }}>

      {/* On Note Deleting */}
      {(deletingOpen.isOpen && deletingOpen.type == "Note") && <DeletingPopUp />}

      {/* Header */}
      <View
        style={{
          height: 105,
          backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.background2
        }}>
        <Text style={{
          textAlignVertical: "center",
          color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
          marginTop: 0,
          fontFamily: "Pacifico",
          fontSize: 30,
          textAlign: "center",
        }}>
          Notes
        </Text>
        <Text
          style={{
            fontFamily: "Kavivanar",
            textAlign: "center",
            bottom: 0,
            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
          }}>
          {formatDateToString(day)}
        </Text>
      </View>
      {/* Pop Up to Edit Note */}
      {editNoteOpen.isOpen && <EditNoteScreen />}
      <DayChangerContainer />

      {/* Notes */}
      <View
        style={{
          height: "80%",
          backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.background,
        }}>
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
          ListFooterComponent={<CreateNote />} // Agrega el componente al final
        />


      </View>

    </View >
  );
};


export default NotesTab;
