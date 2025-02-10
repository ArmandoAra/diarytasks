import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

// Components
import Favorite from '@/components/favoriteToggle/favToggle';

// Styles
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { createNote, getNotesByDate } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Svg, { Line } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavProps } from '@/interfaces/types';

const initialNoteData = (day: string) => {
  return {
    id: '',
    title: '',
    message: '',
    isFavorite: 0,
    date: day,
  }

}


const CreateNoteTab = () => {
  const { day, setDayNotes, setLoading, setDay, loading } = useGlobalContext();
  const [notesError, setNotesError] = useState<string>('');
  const [note, setNote] = useState<CreateNoteProps>(initialNoteData(day));
  const navigation = useNavigation<BottomTabNavProps>();

  const handleChanges = (key: keyof CreateNoteProps, value: string | boolean | number) => {
    setNote((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    createNote(note)
      .then(() => {
        setLoading(false);
        navigation.navigate("HomeTab");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  };

  useEffect(() => {
    setNote(initialNoteData(day))
  }, [day, loading])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View style={styles.container}>
        <View style={{
          backgroundColor: Colors.light.secondary2,
          width: "90%",
          marginHorizontal: "5%",
          padding: 10,
          gap: 10,
          marginTop: 15,
          // sombra
          elevation: 5
        }}>

          <View style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={styles.label}>Create Note</Text>
            <View style={{ flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <Text style={{
                fontSize: 16
                , fontFamily: "Kavivanar"
                , textAlign: "center"
                , color: Colors.light.background2,
                backgroundColor: Colors.light.primary,
                height: 30, paddingHorizontal: 5,
              }}>{day}</Text>

              <TouchableOpacity onPress={() => handleChanges("isFavorite", note.isFavorite == 1 ? 0 : 1)}>
                {note.isFavorite == 0 ? (
                  <Fontisto name="heart-alt" size={24} color="red" />
                ) : (
                  <Fontisto name="heart" size={24} color="red" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ overflow: "scroll", backgroundColor: Colors.light.primaryDark, borderRadius: 16 }}>
            {/* Note Background */}
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
              value={note.title}
              onChangeText={(value) => handleChanges("title", value)}
              placeholder="Enter title"
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
              value={note.message}
              onChangeText={(value) => handleChanges("message", value)}
              placeholder="Enter note message"
              numberOfLines={5}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={{ width: "100%", flexDirection: "row", height: 60, justifyContent: "flex-end", paddingTop: 10, paddingRight: 20 }}>
          <TouchableOpacity onPress={handleSubmit} style={{ right: 0, position: "relative" }} >
            <MaterialIcons name="note-add" size={38} color={Colors.light.background2} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

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
    textAlignVertical: 'bottom',
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

export default CreateNoteTab;
