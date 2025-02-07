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
} from 'react-native';
import { router, Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';


// Utils
import { searchTaskById } from '@/Utils/helpFunctions';

// Date Picker
import { Button as PickerButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { getTasksByDate, updateTaskById } from '@/db/taskDb';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
registerTranslation('en', en)



const EditTaskScreen = () => {
  const route = useRoute();

  const { id } = route.params as { id: string };
  const { tasks, setTasks, setLoading } = useGlobalContext();
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
    const selectedTask = searchTaskById(id, tasks);
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
    updateTaskById(id.toString(), data)

    const fetchTasks = async () => {

      const response = await getTasksByDate(data.date);
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setTasksError(response.message || 'An error occurred while fetching tasks.');
      }

    };


    fetchTasks();

    router.push("/")
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <View style={styles.container}>
        <View style={{ backgroundColor: Colors.light.secondary2, width: "90%", marginHorizontal: "5%", padding: 10, borderRadius: 16, marginTop: 20, }}>

          <Text style={styles.label}>Edit Taks</Text>
          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginBottom: 1 }}>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: Colors.light.secondary,
                padding: 15,
                borderRadius: 16,
                width: "45%"
              }}
              value={data.title}
              onChangeText={(value) => handleChanges("title", value)}
              placeholder="Enter task title"
            />
            <View style={{ borderRadius: 16, borderWidth: 1, backgroundColor: '#a8232300', width: "45%", height: 50 }}>
              <Picker
                selectedValue={data.priority}
                onValueChange={(value) => handleChanges("priority", value)}
                style={{ backgroundColor: '#a8232300', color: '#000', height: "100%" }}
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
              backgroundColor: Colors.light.secondary,
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

        <View style={{ width: "100%", flexDirection: "row", height: 60, justifyContent: "flex-end", paddingRight: 20, marginTop: 20 }}>
          <TouchableOpacity onPress={handleSubmit} style={{ right: 0, position: "relative" }} >
            <MaterialIcons name="assignment-add" size={38} color={Colors.light.background2} />
          </TouchableOpacity>
        </View>
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
