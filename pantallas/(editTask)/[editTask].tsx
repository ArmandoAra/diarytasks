import React, { useState } from 'react';
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
import styles from './styles';

// Date Picker
import { Button as PickerButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)


const EditTask = () => {
  const { id } = useLocalSearchParams()

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [status, setStatus] = useState(false);  false = ToDo, true = Completed
  const [importance, setImportance] = useState('Low'); // High, Medium, Low
  const [frequency, setFrequency] = useState('Today'); // Frequency options


  const handleSubmit = () => {
    // const task = {
    //   title,
    //   description,
    //   importance,
    //   frequency,
    // };
    console.log('Task created:');
    router.push("/")
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
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 150, }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          numberOfLines={5}
          multiline
          textAlignVertical='top'
        />
        {/* Importance level */}
        <Text style={styles.label}>Importance Level</Text>
        <View style={{ borderRadius: 10, borderWidth: 1, backgroundColor: '#a8232300', overflow: 'hidden' }}>
          <Picker
            selectedValue={importance}
            onValueChange={(itemValue) => setImportance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
        </View>
      </View>
      {/* Frequency */}
      <View style={{ flex: 3 }}>

        <Text style={styles.label}>Frequency</Text>
        <View style={{ borderRadius: 10, borderWidth: 1, backgroundColor: '#a8232300', overflow: 'hidden' }}>
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Today" value="Today" />
            <Picker.Item label="Select Days" value="Days" />
          </Picker>
          {/* Single Date Picker */}
          {(frequency === 'Days') && (<View style={styles.row}>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
              <PickerButton onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                Pick multiple dates
              </PickerButton>
              <DatePickerModal
                locale="en"
                mode="multiple"
                visible={open}
                onDismiss={onDismiss}
                dates={dates}
                onConfirm={onConfirm}
              />
            </View>
          </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={{ ...styles.createTaskButton, flex: 1 }} >
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



export default EditTask;
