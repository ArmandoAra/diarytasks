import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Styles
import { styles } from './styles';

export default function HomeScreen() {
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} className='bg-orange-800'>Diary Tasks</Text>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hi Armando,</Text>
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

