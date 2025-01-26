import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';

// Styles
import styles from './styles';

// Context
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { Stack, Tabs, Link } from 'expo-router';

export default function HomeScreen() {
  const {
    user
  } = useGlobalContext();

  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} className='bg-orange-800'>Diary Tasks</Text>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hi {user},</Text>
        {/* Día de hoy (también debe tener un selector de fechas para cambiar y el límite de inicio debe ser el primer día
        que abrió la app) */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>Today is Samstag 18th, January</Text>
          {/* Botón Select Day */}
          <TouchableOpacity style={styles.selectDayButton}>
            <Text style={styles.selectDayButtonText}>Select Day</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TasksContainer />
      <NotesContainer />

    </ScrollView>

  );
}

