import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

// Components
import Favorite from '@/components/favoriteToggle/favToggle';

// Styles
import styles from '../../../styles/createNoteStyles';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { createNote, getNotesByDate } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';

const initialNoteData = (day: string) => {
  return {
    id: '',
    title: '',
    message: '',
    isFavorite: 0,
    date: day,
  }

}


export default function CreateNoteScreen() {
  const { day, setDayNotes } = useGlobalContext();
  const [notesError, setNotesError] = useState<string>('');
  const [note, setNote] = useState<CreateNoteProps>(initialNoteData(day));

  const handleChanges = (key: keyof CreateNoteProps, value: string | boolean | number) => {
    setNote((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    createNote(note)
    const fetchNotesDay = async () => {
      const response = await getNotesByDate(day);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        setNotesError(response.message || 'An error occurred while fetching notes.');
      }
    };
    fetchNotesDay();
    setNote(initialNoteData(day));

    router.push("/")
  };

  useEffect(() => {
    setNote(initialNoteData(day))
  }, [day])

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 12, paddingHorizontal: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
          <Text style={styles.label}>Title</Text>
          <TouchableOpacity onPress={() => {
            if (note.isFavorite == 1) {
              handleChanges("isFavorite", 0)
            } else {
              handleChanges("isFavorite", 1)
            }
          }}>
            <Text>{note.isFavorite == 1 ? "🌟" : "☆"}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          value={note.title}
          onChangeText={(value) => handleChanges("title", value)}
          placeholder="Enter title"
        />
        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={note.message}
          onChangeText={(value => handleChanges("message", value))}
          placeholder="Enter note message"
          numberOfLines={5}
          multiline
          textAlignVertical='top'
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={{ ...styles.createTaskButton, flex: 1 }} >
        <Text style={styles.createTaskButtonText}>Create Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
