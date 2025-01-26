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

// Styles
import styles from '../../../styles/editTaskStyles';

// Date Picker
import { Button as PickerButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
import { useGlobalContext } from '@/context/GlobalProvider';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { getTasksByDate, updateTaskById } from '@/db/taskDb';
registerTranslation('en', en)

export function searchTaskById(id: string | string[], data: CreateTaskProps[]) {
  const result = data.filter((task) => task.id == id);
  return result;
}



const EditTask = () => {
  const { id } = useLocalSearchParams()
  const { tasks, setTasks } = useGlobalContext();
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

    router.push("/home")
  };

  //Single Date Picker
  const [dates, setDates] = React.useState();
  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback((params: any) => {
    setOpen(false);
    setDates(params.dates);
    console.log('[on-change-multi]', params);
  }, []);

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
            onValueChange={(value) => handleChanges("description", value)}
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



export default EditTask;
