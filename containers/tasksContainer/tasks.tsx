import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Task from '../../components/task/task'; // Ajusta la ruta según tu proyecto
import { router, useNavigation } from 'expo-router';

const TasksContainer = () => {
    const [sortOption, setSortOption] = React.useState("Today");

    return (
        <View style={styles.container_Tasks}>
            {/* Header con Select y Botón */}
            <View style={styles.header_Tasks}>
                {/* Select para ordenar */}
                <Picker
                    selectedValue={sortOption}
                    style={styles.picker_Tasks}
                    mode="dropdown"
                    onValueChange={(itemValue) => setSortOption(itemValue)}
                >
                    <Picker.Item label="Today" value="Today" />
                    <Picker.Item label="Importants Today" value="Importants" />
                    <Picker.Item label="This Week" value="This Week" />
                    <Picker.Item label="From Today One Month" value="This Month" />
                </Picker>

                {/* Botón para crear nueva tarea */}
                <TouchableOpacity
                    style={styles.newTaskButton_Tasks}
                    onPress={() => router.push("./createTask")}
                    accessibilityLabel="Create New Task">
                    {/* Irir a la pantalla para crear nueva tarea  */}
                    <Text style={styles.newTaskButtonText_Tasks}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Filtros de tareas */}
            <View style={styles.taskFilters_Tasks}>
                <TouchableOpacity style={styles.filterButton_Tasks}>
                    <Text style={styles.filterText_Tasks}>To Do</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton_Tasks}>
                    <Text style={styles.filterText_Tasks}>Completed</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de tareas */}
            <View style={styles.tasksList_Tasks}>
                <Task
                    title="Task 1"
                    description="This is a test description of the first task of the list just testing the components and the containers"
                    importanceLevel="High"
                />
                <Task
                    title="Task 2"
                    description="Another test description for the task container layout"
                    importanceLevel="Medium"
                />
                <Task
                    title="Task 3"
                    description="Adding a third example task to test the design"
                    importanceLevel="Low"
                />
            </View>
        </View>
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
    picker_Tasks: {
        flex: 1,
        backgroundColor: "#000",
        color: "#fff",
        marginRight: 10,
        borderRadius: 12,
    },
    newTaskButton_Tasks: {
        backgroundColor: "#86efac", // green-200
        width: '15%',
        padding: 10,
        borderRadius: 12,
    },
    newTaskButtonText_Tasks: {
        color: "#000",
        fontSize: 18,
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

export default TasksContainer;
