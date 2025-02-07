import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, BackHandler, Alert } from 'react-native';

// Components
import Header from '@/components/header/header';
import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';

// Context
import { useGlobalContext } from '@/context/GlobalProvider';
import { getTasksByDate } from '@/db/taskDb';
import { getNotesByDate } from '@/db/noteDb';
import ThemedView from '@/Theme/themedView/themedView';

export default function Home() {
  const {
    day,
    setTasks,
    loading,
    setDayNotes,
  } = useGlobalContext();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasksByDate(day);
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        console.log(response.message || 'An error occurred while fetching tasks.');
      }
    };

    const fetchNotesDay = async () => {
      const response = await getNotesByDate(day);
      if (response.success && response.data) {
        setDayNotes(response.data);
      } else {
        console.log(response.message || 'An error occurred while fetching notes.');
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
    <ThemedView style={{ flex: 1, gap: 3 }}  >
      <Header />
      <TasksContainer />
      <NotesContainer />
    </ThemedView>
  );
}

