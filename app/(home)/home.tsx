import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';

// Date Picker
import { Button as PickerButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

// Styles
import styles from '../../styles/homeStyles';

// Context
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { Stack, Tabs, Link } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { getAllTasks, getTasksByDate } from '@/db/taskDb';
import { formatDate, formatDateToString } from '@/Utils/helpFunctions';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';

export default function HomeScreen() {
  const {
    user,
    day,
    tasks,
    setDay,
    setTasks
  } = useGlobalContext();

  const [tasksError, setTasksError] = useState<string>("");
  // formatDate(new Date)

  //Single Date Picker
  const [date, setDate] = React.useState();
  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback((params: any) => {
    setOpen(false);
    setDay(formatDate(params.date));
  }, []);


  // Obteniendo las tareas
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasksByDate(day);
      // const response = await getAllTasks(); 
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setTasksError(response.message || 'An error occurred while fetching tasks.');
      }
    };
    fetchTasks();
  }, [day])


  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} className='bg-orange-800'>Diary Tasks</Text>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hi {user},</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDateToString(day)}</Text>
          {/* Botón Select Day */}
          <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <PickerButton onPress={() => setOpen(true)} uppercase={false} mode="outlined">
              Select Day
            </PickerButton>
            <DatePickerModal
              saveLabel='Go to'
              locale="en"
              mode="single"
              visible={open}
              onDismiss={onDismiss}
              date={date}
              onConfirm={onConfirm}
            />
          </View>
        </View>
      </View>

      <TasksContainer />
      <NotesContainer />

    </ScrollView>

  );
}

