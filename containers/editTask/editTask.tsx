import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Utils
import { searchTaskById } from '@/Utils/helpFunctions';

// Date Picker
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { getTasksByDate, updateTaskById } from '@/db/taskDb';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
registerTranslation('en', en)

const EditTaskScreen = () => {
  const { theme } = useThemeContext();
  const { tasks, setTasks } = useGlobalContext();
  const { setLoading, setEditTaskOpen, editTaskOpen } = useStatesContext();
  const [tasksError, setTasksError] = useState<string>("");

  const [data, setData] = useState<CreateTaskProps>(
    {
      id: "",
      title: '',
      description: '',
      status: 'Completed',
      priority: 'Low',
      date: '',
    }
  );

  useEffect(() => {

    const selectedTask = searchTaskById(editTaskOpen.id, tasks);
    setData((prevData) => ({
      ...prevData,
      title: selectedTask[0].title,
      description: selectedTask[0].description,
      priority: selectedTask[0].priority,
      status: selectedTask[0].status,
      date: selectedTask[0].date
    }));

  }, [])

  const handleChanges = (key: keyof CreateTaskProps, value: string | Date) => {
    setData(prevData => {
      if (prevData[key] === value) return prevData;
      return { ...prevData, [key]: value };
    });
  };

  const handleSubmit = () => {
    if (!data.description) {
      return Alert.alert("Message is required", "Please enter a message for the task.");
    }
    updateTaskById(editTaskOpen.id.toString(), data)
    setLoading(true);
    const fetchTasks = async () => {
      const response = await getTasksByDate(data.date);
      if (response.success && response.data) {
        setTasks(response.data);
        setLoading(false);
      } else {
        setTasksError(response.message || 'An error occurred while fetching tasks.');
        setLoading(false);
      }
    };
    fetchTasks();

    setEditTaskOpen({ isOpen: false, id: "" })
  };


  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.background2,
        zIndex: 10

      }}>
      <View
        style={{
          backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.secondary2,
          width: "90%",
          marginHorizontal: "5%",
          padding: 10,
          borderRadius: 16,
          marginTop: 20,
          gap: 10,
        }}>
        <View
          style={{ flexDirection: "row" }}>
          <Text style={styles.label}>Edit Tak</Text>
          <TouchableOpacity
            onPress={() => setEditTaskOpen({ isOpen: false, id: "" })}
            style={{
              backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.ternary2,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              right: 10,
              elevation: 5
            }}>
            <FontAwesome name="close" size={34} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 1
          }}>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.background2,
              color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
              paddingLeft: 15,
              borderRadius: 16,
              width: "45%", height: 50,
            }}
            value={data.title}
            onChangeText={(value) => handleChanges("title", value)}
            placeholder="Task title"
          />
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              backgroundColor: '#a8232300',
              width: "45%",
              height: 50
            }}>
            <Picker
              selectedValue={data.priority}
              onValueChange={(value) => handleChanges("priority", value)}

              style={{
                backgroundColor: '#a8232300',
                color: '#000',
                height: "100%"
              }}
            >
              <Picker.Item label="High" value="High" style={{ fontSize: 11 }} />
              <Picker.Item label="Medium" value="Medium" style={{ fontSize: 11 }} />
              <Picker.Item label="Low" value="Low" style={{ fontSize: 11 }} />
            </Picker>
          </View>

        </View>
        <TextInput
          style={{
            ...styles.input,
            height: 150,
            backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.background2,
            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
            padding: 15,
            borderRadius: 16,
            marginBottom: 10
          }}
          value={data.description}
          onChangeText={(value) => handleChanges("description", value)}
          placeholder="Enter task description"
          numberOfLines={5}
          multiline
          textAlignVertical="top"
        />

      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          height: 60,
          justifyContent: "flex-end",
          paddingRight: 20,
          marginTop: 20
        }}>
        {data.description && <TouchableOpacity onPress={handleSubmit} style={{ right: 0, position: "relative" }} >
          <AntDesign name="pluscircle" size={50} color={theme == "light" ? Colors.light.secondary : Colors.dark.secondary2} />

        </TouchableOpacity>}
      </View>

    </ScrollView >

  );
};

const styles = StyleSheet.create({
  container: {

    height: 400,
    width: '90%',
    borderRadius: 19,
    marginTop: 40,
    marginHorizontal: 'auto',
    alignContent: "space-around",
    backgroundColor: Colors.light.secondary,
  },
  label: {
    width: "90%",
    height: 70,
    fontSize: 30,
    fontFamily: 'Pacifico',
    textAlign: 'center',
    textAlignVertical: 'center',

  },
  input: {
    alignContent: 'flex-start',
    fontSize: 16,
    fontFamily: 'Kavivanar',
  },
});

export default EditTaskScreen;
