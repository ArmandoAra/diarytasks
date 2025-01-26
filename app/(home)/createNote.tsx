import React, { useState } from 'react';
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
import styles from '../../styles/createNoteStyles';


export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [status, setStatus] = useState(false);  false = ToDo, true = Completed
  const [favorite, setFavorite] = useState(false); // High, Medium, Low

  const handleSubmit = () => {
    // console.log('Task created:');
    router.push("/")
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 12, paddingHorizontal: 4 }}>

        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
          <Text style={styles.label}>Title</Text>
          <Favorite isFavorite={favorite} setIsFavorite={setFavorite} />
        </View>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={description}
          onChangeText={setDescription}
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
