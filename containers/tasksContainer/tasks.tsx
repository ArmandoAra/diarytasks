import React, { forwardRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Pressable, TextStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Task from '../../components/task/task'; // Ajusta la ruta según tu proyecto
import { Link, router } from 'expo-router';

import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '../../constants/Colors';
import { CreateTaskProps, SortOption } from '@/interfaces/TasksInterfaces';


const TasksContainer = () => {
    const [sortOption, setSortOption] = React.useState<SortOption>("All");
    const { tasks, setTasks, setLoading } = useGlobalContext();


    const [sortedTasks, setSortedTasks] = useState<CreateTaskProps[]>(tasks);


    useEffect(() => {
        if (sortOption === 'All') {
            setSortedTasks(tasks);
        } else {
            setSortedTasks(tasks.filter(task => task.status === sortOption));
        }

    }, [sortOption, tasks]);


    return (
        <View style={styles.container_Tasks}>
            {/* Header con Select y Botón */}
            <View style={styles.header_Tasks}>
                {/* Select para ordenar */}
                <View style={{ width: 300, backgroundColor: "white", borderRadius: 16 }}>
                    <Picker
                        selectedValue={sortOption}
                        style={{ borderRadius: 16, borderWidth: 1, backgroundColor: '#a8232300', overflow: 'hidden' }}
                        mode="dropdown"
                        onValueChange={(itemValue) => setSortOption(itemValue)}

                    >
                        <Picker.Item label="All Tasks" value="All" />
                        <Picker.Item label="Completed" value="Completed" />
                        <Picker.Item label="ToDo" value="ToDo" />
                    </Picker>
                </View>

                {/* Botón para crear nueva tarea */}
                <Pressable
                    style={styles.newTaskButton_Tasks}
                    onPress={() => router.push('/createTask')}
                    accessibilityLabel="Create New Task">
                    {/* Irir a la pantalla para crear nueva tarea  */}
                    <Text style={styles.newTaskButtonText_Tasks}>+</Text>
                </Pressable>
            </View>

            {/* Lista de tareas */}
            <View style={styles.tasksList_Tasks}>
                {sortedTasks.map(task => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        status={task.status}
                        date={task.date || ""}
                    />
                ))}

            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container_Tasks: {
        backgroundColor: "#0c4a6e", // sky-950
        width: '100%',
        borderRadius: 16,
        padding: 10,
        margin: 10,
    },
    header_Tasks: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    picker_Tasks_Container: {
        flex: 1,
        height: 60,
        margin: 5,
        alignContent: "center",
        overflow: 'hidden',
        borderRadius: 16,
        alignItems: "center",
    },
    picker_Tasks: {
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    newTaskButton_Tasks: {
        backgroundColor: "#86efac", // green-200
        width: '15%',
        padding: 10,
        borderRadius: 12,
    },
    newTaskButtonText_Tasks: {
        color: "#000",
        fontSize: 30,
        textAlign: "center",
    },
    taskFilters_Tasks: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 15,
    },
    filterButton_Tasks: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    filterText_Tasks: {
        color: "#000",
        textAlign: "center",
    },
    tasksList_Tasks: {

    },
});

const stylesDrop = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default TasksContainer;
