import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CreateNoteScreen() {
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text >Create Note</Text>

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
