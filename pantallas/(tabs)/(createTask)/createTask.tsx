import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useGlobalContext } from '@/context/GlobalProvider';

//interfaces
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';

// Db
import { createTask, getTasksByDate } from '@/db/taskDb';
import { useRoute } from '@react-navigation/native';

const CreateTask = () => {
    const route = useRoute();
    const { day, setTasks } = useGlobalContext();

    const [data, setData] = useState<CreateTaskProps>(
        {
            id: "",
            title: '',
            description: '',
            status: 'ToDo',
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

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await getTasksByDate(day);
            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching tasks.');
            }
        };



        fetchTasks();
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
                console.log(response.message || 'An error occurred while fetching tasks.');
            }
        };
        fetchTasks();

        router.push("/")
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container} >
                <View style={{ flex: 12 }}>
                    <Text style={styles.label}>Title create Task </Text>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        alignContent: "space-around",
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        alignContent: 'flex-start',
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    picker: {
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    createTaskButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: 15,
        height: 50,
        marginTop: 20,
        marginBottom: 40,
    },
    createTaskButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 'auto',
    },
});

export default CreateTask;