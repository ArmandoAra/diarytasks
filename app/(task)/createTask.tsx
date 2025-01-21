import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CreateTaskScreen() {
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text >Create Task</Text>
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
});
