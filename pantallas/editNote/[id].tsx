import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Components
import Favorite from '@/components/favoriteToggle/favToggle';

// Styles
import styles from './styles';
import { useGlobalContext } from '@/context/GlobalProvider';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';

//Utils
import { searchNoteById } from '@/Utils/helpFunctions';
import { getNotesByDate, updateNoteById } from '@/db/noteDb';


export default function EditNote() {
  const { id } = useLocalSearchParams()

  const { day, dayNotes, setDayNotes } = useGlobalContext();
  const [tasksError, setNotesError] = useState<string>("");
  const titleInputRef = React.useRef<TextInput>(null);


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
    // Enfocar el campo de título automáticamente al cargar
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const selectedNote = searchNoteById(id, dayNotes);
    console.log(selectedNote)
    setData((prevData) => ({
      ...prevData,
      title: selectedNote[0].title,
      message: selectedNote[0].message,
      isFavorite: selectedNote[0].isFavorite,
      date: selectedNote[0].date
    }));

  }, []);

  const handleChanges = (key: keyof CreateNoteProps, value: string | boolean) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    updateNoteById(id.toString(), data)
    const fetchNotesDay = async () => {
      const response = await getNotesByDate(day);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        setNotesError(response.message || 'An error occurred while fetching notes.');
      }
    };

    fetchNotesDay();

    router.push("/home")
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 12, paddingHorizontal: 4 }}>

        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
          <Text style={styles.label}>Title</Text>
          <Favorite isFavorite={data.isFavorite} setIsFavorite={handleChanges} />
        </View>
        <TextInput
          ref={titleInputRef}
          style={styles.input}
          value={data.title}
          onChangeText={(value) => handleChanges("title", value)}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={data.message}
          onChangeText={(value) => handleChanges("message", value)}
          placeholder="Enter note message"
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
