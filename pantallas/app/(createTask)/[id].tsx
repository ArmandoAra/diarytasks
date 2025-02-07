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
registerTranslation('en', en)



const EditTask = () => {
  const { id } = useLocalSearchParams()
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
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
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
    <ScrollView style={styles.container}>

      <View style={{ flex: 12 }}>


        <Text style={styles.label}>Title Tarea {id}</Text>
        <TextInput
          style={styles.input}
          value={data.title}
          onChangeText={(value) => handleChanges("title", value)}
          placeholder="Enter task title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={data.description}
          onChangeText={(value) => handleChanges("description", value)}
          placeholder="Enter task description"
          numberOfLines={5}
          multiline
          textAlignVertical='top'
        />
        {/* Importance level */}
        <Text style={styles.label}>Priority</Text>
        <View style={{ borderRadius: 10, borderWidth: 1, backgroundColor: '#a8232300', overflow: 'hidden' }}>
          <Picker
            selectedValue={data.priority}
            onValueChange={(value) => handleChanges("priority", value)}
            style={styles.picker}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={{ ...styles.createTaskButton, flex: 1 }} >
        <Text style={styles.createTaskButtonText}>Update Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignContent: "space-around",
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    alignContent: 'flex-start',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  createTaskButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 15,
    height: 50,
    marginTop: 20,
    marginBottom: 40,
  },
  createTaskButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 'auto',
  },
});



export default EditTask;
