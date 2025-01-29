import React, { forwardRef, HtmlHTMLAttributes, useEffect, useState } from 'react';
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
import { router, useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

// Styles
import styles from '../../styles/createTaskStyles';

//interfaces
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate } from '@/Utils/helpFunctions';
import { createTask, getTasksByDate } from '@/db/taskDb';
import { useGlobalContext } from '@/context/GlobalProvider';



const CreateTask = () => {
  const { day, setTasks } = useGlobalContext();
  const [tasksError, setTasksError] = useState<string>("");

  const [data, setData] = useState<CreateTaskProps>(
    {
      id: "",
      title: '',
      description: '',
      status: 'Completed',
      priority: 'Low',
      date: day,
    }
  );

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      date: day,
    }))
  }, [day])





  const handleChanges = (key: keyof CreateTaskProps, value: string | Date) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };


  const onSubmit = async () => {
    createTask(data)
    const fetchTasks = async () => {
      const response = await getTasksByDate(day);
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setTasksError(response.message || 'An error occurred while fetching tasks.');
      }
    };
    fetchTasks();

    router.push("/home")
  };


  return (
    <ScrollView style={styles.container} >
      <View style={{ flex: 12 }}>
        <Text style={styles.label}>Title </Text>
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

      <TouchableOpacity onPress={onSubmit} style={{ ...styles.createTaskButton, flex: 1 }} >
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



export default CreateTask;
