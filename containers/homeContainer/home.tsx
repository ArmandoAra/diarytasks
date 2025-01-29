import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, ScrollView, TouchableOpacity, Pressable, BackHandler, Alert } from 'react-native';

// Components
import Header from '@/components/header/header';

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
import { getNotesByDate } from '@/db/noteDb';
import { useNavigationState } from '@react-navigation/native';

export default function Home() {
  const {
    day,
    setTasks,
    loading,
    setDayNotes,
  } = useGlobalContext();

  const [tasksError, setTasksError] = useState<string>("");
  const [notesError, setNotesError] = useState<string>('');


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

    const fetchNotesDay = async () => {
      const response = await getNotesByDate(day);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        setNotesError(response.message || 'An error occurred while fetching notes.');
      }
    };

    fetchNotesDay();
    fetchTasks();
  }, [day, loading])


  // // Probando el backHandler
  // useEffect(() => {
  //   // Función que se ejecutará cuando el usuario presione "Atrás"
  //   const handleBackPress = () => {
  //     console.log(currentRoute)
  //     Alert.alert(
  //       'Confirmación',
  //       '¿Estás seguro que deseas salir?',
  //       [
  //         { text: 'Cancelar', style: 'cancel' },
  //         { text: 'Salir', onPress: () => router.push('/') },
  //       ],
  //       { cancelable: true }
  //     );
  //     return true; // Evita que el gesto cierre la app automáticamente
  //   };

  //   // Agregar el listener al montar el componente
  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //   // Limpiar el listener al desmontar el componente
  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  // }, []);


  return (

    <ScrollView contentContainerStyle={styles.container}>

      <Header />
      <TasksContainer />
      <NotesContainer />

    </ScrollView>

  );
}

