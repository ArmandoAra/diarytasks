import React, { useEffect, useState } from 'react';
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

import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

// Styles
// import styles from '../../../styles/editTaskStyles';

// Utils
import { searchNoteById, searchTaskById } from '@/Utils/helpFunctions';

// Date Picker
import { Button as PickerButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { getTasksByDate, updateTaskById } from '@/db/taskDb';
import { getNotesByDate, updateNoteById } from '@/db/noteDb';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import Svg, { Line } from 'react-native-svg';
import navigation from '@react-navigation/native';
import { BottomTabNavProps } from '@/interfaces/types';
registerTranslation('en', en)



const EditNoteScreen = () => {

  const { dayNotes, setDayNotes, setEditNoteOpen, editNoteOpen } = useGlobalContext();
  const [notesError, setNotesError] = useState<string>("");
  const navigation = useNavigation<BottomTabNavProps>();

  const [data, setData] = useState<CreateNoteProps>(
    {
      id: "",
      title: '',
      message: '',
      isFavorite: 0,
      date: '',
    }
  );

  useEffect(() => {
    const selectedNote = searchNoteById(editNoteOpen.id, dayNotes);
    setData((prevData) => ({
      ...prevData,
      title: selectedNote[0].title,
      message: selectedNote[0].message,
      isFavorite: selectedNote[0].isFavorite,
      date: selectedNote[0].date
    }));

  }, [])

  const handleChanges = (key: keyof CreateNoteProps, value: string | Date) => {
    setData(prevData => {
      if (prevData[key] === value) return prevData;
      return { ...prevData, [key]: value };
    });
  };

  const handleSubmit = () => {
    updateNoteById(editNoteOpen.id.toString(), data)

    const fetchTasks = async () => {
      const response = await getNotesByDate(data.date);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        setNotesError(response.message || 'An error occurred while fetching tasks.');
      }
    };


    fetchTasks();

    setEditNoteOpen({ isOpen: false, id: "" })
  };




  return (
    <View style={{ width: "100%", height: "100%", zIndex: 10, backgroundColor: Colors.light.background }}>
      <View style={styles.container}>
        <View style={{
          backgroundColor: Colors.light.secondary2,
          width: "90%",
          marginHorizontal: "5%",
          padding: 10,
          borderRadius: 16,
          gap: 10,
          marginTop: 15
        }}>
          {/* Encabezado con título y botón de favorito */}
          <View style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={styles.label}>Edit Note</Text>
            <TouchableOpacity onPress={() => handleChanges("isFavorite", data.isFavorite == 1 ? 0 : 1)}>
              {data.isFavorite == 0 ? (
                <Fontisto name="heart-alt" size={24} color="red" />
              ) : (
                <Fontisto name="heart" size={24} color="red" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ position: "relative", top: -20, right: -10 }} onPress={() => setEditNoteOpen({ isOpen: false, id: "" })}>
              <FontAwesome name="close" size={34} color={Colors.light.primary} /></TouchableOpacity>
          </View>

          {/* Fondo estilo libreta */}
          <View style={{ overflow: "scroll", backgroundColor: Colors.light.primaryDark, borderRadius: 16 }}>
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
              style={{
                ...styles.input,
                padding: 15,
              }}
              value={data.title}
              onChangeText={(value) => handleChanges("title", value)}
              placeholder="Enter note title"
            />
            <TextInput
              style={{
                ...styles.input,
                height: 150,
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginBottom: 10,
                lineHeight: 23.4,
              }}
              value={data.message}
              onChangeText={(value) => handleChanges("message", value)}
              placeholder="Enter message description"
              numberOfLines={5}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botón de acción flotante */}
        <View style={{ width: "100%", flexDirection: "row", height: 60, justifyContent: "flex-end", paddingTop: 10, paddingRight: 20 }}>
          <TouchableOpacity onPress={handleSubmit} style={{ right: 0, position: "relative" }} >
            <MaterialIcons name="note-add" size={38} color={Colors.light.background2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: '90%',
    borderRadius: 19,
    marginTop: 40,
    marginHorizontal: 'auto',
    backgroundColor: Colors.light.secondary,
  },
  label: {
    height: 70,
    fontSize: 30,
    fontFamily: 'Pacifico',
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  input: {
    alignContent: 'flex-start',
    fontSize: 16,
    fontFamily: 'Kavivanar',
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

export default EditNoteScreen;
