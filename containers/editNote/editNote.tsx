import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';


// Styles
// import styles from '../../../styles/editTaskStyles';

// Utils
import { searchNoteById } from '@/Utils/helpFunctions';

// Date Picker
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { getNotesByDate, updateNoteById } from '@/db/noteDb';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { AntDesign, FontAwesome, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import Svg, { Line } from 'react-native-svg';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
registerTranslation('en', en)


const EditNoteScreen = () => {
  const { dayNotes, setDayNotes } = useGlobalContext();
  const { setEditNoteOpen, editNoteOpen } = useStatesContext();
  const { theme } = useThemeContext();

  const initialData = {
    id: "",
    title: '',
    message: '',
    isFavorite: 0,
    date: '',
  }

  const [data, setData] = useState<CreateNoteProps>(initialData);

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

  const handleSubmit = async () => {
    if (!data.message) return Alert.alert("Message is required", "Please enter a message for the note.");

    updateNoteById(editNoteOpen.id.toString(), data)
    getNotesByDate(data.date).then((notes) => setDayNotes(notes.data as CreateNoteProps[]))
    setEditNoteOpen({ isOpen: false, id: "" })
  };

  return (

    <View
      style={{
        height: "100%",
        width: "100%",
        top: 105,
        position: 'absolute',
        marginHorizontal: 'auto',
        backgroundColor: theme == "light" ? Colors.light.secondary2 : Colors.dark.background2,
        zIndex: 100,
      }}>
      <View
        style={{
          backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.primary2,
          width: "90%",
          marginHorizontal: "5%",
          padding: 10,
          borderRadius: 16,
          gap: 10,
          marginTop: 15
        }}>
        {/* Encabezado con título y botón de favorito */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
          <Text
            style={{
              height: 70,
              fontSize: 30,
              fontFamily: 'Pacifico',
              textAlign: 'right',
              textAlignVertical: 'center',
              color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
            }}>
            Edit Note
          </Text>
          <TouchableOpacity onPress={() => handleChanges("isFavorite", data.isFavorite == 1 ? "0" : "1")}>
            {data.isFavorite == 0 ? (
              <Fontisto name="heart-alt" size={24} color="red" />
            ) : (
              <Fontisto name="heart" size={24} color="red" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditNoteOpen({ isOpen: false, id: "" })}
            style={{
              backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.secondary2,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              elevation: 5
            }}
          >
            <FontAwesome name="close" size={34} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
          </TouchableOpacity>
        </View>

        {/* Fondo estilo libreta */}
        <View
          style={{
            overflow: "scroll",
            borderRadius: 16,
            backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.ternary,
          }}>
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
              alignContent: 'flex-start',
              fontSize: 16,
              fontFamily: 'Kavivanar',
              padding: 15,
              color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
            }}
            value={data.title}
            onChangeText={(value) => handleChanges("title", value)}
            placeholder="Enter note title"
          />
          <TextInput
            style={{
              alignContent: 'flex-start',
              fontSize: 16,
              fontFamily: 'Kavivanar',
              height: 150,
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginBottom: 10,
              lineHeight: 23.4,
              color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
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
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          height: 60,
          justifyContent: "flex-end",
          paddingTop: 10,
          paddingRight: 20
        }}>
        {data.message &&
          <TouchableOpacity onPress={handleSubmit} style={{ right: 0, position: "relative" }} >
            <AntDesign name="pluscircle" size={50} color={theme == "light" ? Colors.light.secondary : Colors.dark.secondary2} />
          </TouchableOpacity>}
      </View>
    </View>

  );
};


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
