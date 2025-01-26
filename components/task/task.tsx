import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Pressable,
} from 'react-native';
// Styles
import { styles } from './styles';

// Interfaces
import { CreateTaskProps } from '../../interfaces/TasksInterfaces';
import { Link } from 'expo-router';

import { deleteTaskById, getAllTasks, getTasksByDate } from '@/db/taskDb';
import { useGlobalContext } from '@/context/GlobalProvider';

var priorityHighColor = "#590000";
var priorityMediumColor = "#767600";
var priorityLowColor = "#006400";



const Task = ({
    id,
    title,
    description,
    priority,
    date,
}: CreateTaskProps) => {
    const [priorityColor, setpriorityColor] = useState<string>(priorityLowColor);
    const { day, setTasks } = useGlobalContext();
    const [tasksError, setTasksError] = useState<string>("");


    // Logica para el doble  tap de la tarea
    const [lastTap, setLastTap] = useState(0);
    const DOUBLE_TAP_DELAY = 300; // Tiempo en milisegundos para considerar un doble tap
    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            // Acción a realizar en doble tap
            console.log(date)
            alert('Doble Tap Detectado');
        }
        setLastTap(now);
    };


    // Implementado el color de priority
    useEffect(() => {
        switch (priority) {
            case "High":
                setpriorityColor(priorityHighColor);
                break;
            case "Medium":
                setpriorityColor(priorityMediumColor);
                break;
            case "Low":
                setpriorityColor(priorityLowColor);
                break;
        }
    }, []);

    const handleTaskDelete = async () => {
        const deleteTask = async () => {
            const response = await deleteTaskById(id);
            if (response.success && response.data) {
                const response = await getAllTasks();
                if (response.success && response.data) {
                    setAllTasks(response.data);
                }
            };

        }

        const fetchTasks = async () => {
            const response = await getTasksByDate(day);
            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                setTasksError(response.message || 'An error occurred while fetching tasks.');
            }
        };

        deleteTask();
        fetchTasks();
        console.log(`Task ${id} Eliminada correctamente`)
    }

    return (
        <Pressable style={styles.taskContainer} onPress={handleDoubleTap}>
            <View style={styles.taskHeader}>
                <Text style={styles.title}>{title}</Text>
                <Text style={{ ...styles.priorityLevel, backgroundColor: priorityColor }}>{priority}</Text>
            </View>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.actionContainer}>
                <Text style={styles.actionTextHint}>Double Tap to Complete</Text>

                <View>
                    <Link
                        href={{
                            pathname: '/editTask/[id]',
                            params: { id }
                        }}  >
                        ✏️
                    </Link>
                </View>
                <TouchableOpacity onPress={handleTaskDelete}>
                    <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>

            </View>
        </Pressable>
    );
};

export default Task;
function setAllTasks(data: any) {
    throw new Error('Function not implemented.');
}

