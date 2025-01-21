import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white', // Ajusta según el diseño
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  greetingContainer: {
    width: '100%',
    padding: 10,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10, // Puedes usar margenes si tu versión no soporta gap
  },
  date: {
    fontSize: 16,
  },
  selectDayButton: {
    backgroundColor: '#63b3ed', // Azul claro
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  selectDayButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
