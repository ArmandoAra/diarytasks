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
import { router, Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

// Styles
import styles from '../../../styles/editTaskStyles';

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
registerTranslation('en', en)



const EditNote = () => {
  const { id } = useLocalSearchParams()
  const { dayNotes, setDayNotes } = useGlobalContext();
  const [notesError, setNotesError] = useState<string>("");

  const [data, setData] = useState<CreateNoteProps>(
    {
      id: "",
      title: '',
      message: '',
      isFavorite: false,
      date: '',
    }
  );

  useEffect(() => {
    const selectedNote = searchNoteById(id, dayNotes);
    setData((prevData) => ({
      ...prevData,
      title: selectedNote[0].title,
      message: selectedNote[0].message,
      isFavotite: selectedNote[0].isFavorite,
      date: selectedNote[0].date
    }));

  }, [])

  const handleChanges = (key: keyof CreateNoteProps, value: string | Date) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    updateNoteById(id.toString(), data)

    const fetchTasks = async () => {
      const response = await getNotesByDate(data.date);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        setNotesError(response.message || 'An error occurred while fetching tasks.');
      }
    };


    fetchTasks();

    router.push("/")
  };




  return (
    <ScrollView style={styles.container}>

      <View style={{ flex: 12 }}>


        <Text style={styles.label}>Title Tarea {id}</Text>
        <TextInput
          style={styles.input}
          value={data.title}
          onChangeText={(value) => handleChanges("title", value)}
          placeholder="Enter note title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={data.message}
          onChangeText={(value) => handleChanges("message", value)}
          placeholder="Enter message description"
          numberOfLines={5}
          multiline
          textAlignVertical='top'
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} style={{ ...styles.createTaskButton, flex: 1 }} >
        <Text style={styles.createTaskButtonText}>Update Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



export default EditNote;
