import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
} from 'react-native';
// Styles
import { styles } from './styles';

// Interfaces
import { CreateTaskProps } from '../../interfaces/TasksInterfaces';
import { Link } from 'expo-router';

import { deleteTaskById, getAllTasks, getTasksByDate, updateTaskStatus } from '@/db/taskDb';
import { useGlobalContext } from '@/context/GlobalProvider';

// Utils
import { priorityColorHandler } from '@/Utils/helpFunctions';

// Icons
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StatusIcon } from '@/Utils/renderIcons';

//Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/interfaces/types'; // Importa el tipo de rutas

const Task = ({
    id,
    title,
    description,
    priority,
    date,
    status
}: CreateTaskProps) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { day, setTasks, setLoading, setEditTaskOpen } = useGlobalContext();


    // Logica para el doble  tap de la tarea
    const [lastTap, setLastTap] = useState(0);
    const DOUBLE_TAP_DELAY = 300; // Tiempo en milisegundos para considerar un doble tap
    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            const response = await updateTaskStatus(id, status);
            if (response.success) {
                getTasksByDate(day).then((tasks) => setTasks(tasks.data as CreateTaskProps[]))

            } else {
                alert('Something went wrong updating the task status');
            }
        }
        setLastTap(now);
    };

    const handleTaskDelete = async () => {
        const deleteTask = async () => {
            const response = await deleteTaskById(id);
            if (response.success && response.data) {
                // getTasksByDate(day).then((tasks) => setTasks(tasks.data as CreateTaskProps[]))
            } else {
                return response.error
            }
        }

        deleteTask();
        getTasksByDate(day).then((tasks) => setTasks(tasks.data as CreateTaskProps[]))

    }

    return (
        <Pressable onPress={handleDoubleTap} style={{
            marginTop: 15,
            borderBottomColor: Colors.text.textDark,
            borderBottomWidth: 1,
            borderBottomStartRadius: 13,
            borderBottomEndRadius: 28
        }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "10%" }}>{StatusIcon(status)} </Text>

                <View style={{ justifyContent: "space-between", width: "85%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{
                            fontSize: 14,
                            width: "80%",
                            fontFamily: "Cagliostro",
                            borderBottomWidth: 1,
                            borderStyle: "dashed",
                            borderColor: Colors.text.textDark,
                        }}>{title.toLocaleUpperCase()}</Text>

                        <Text style={{
                            fontSize: 10,
                            backgroundColor: priorityColorHandler(priority),
                            height: 20,
                            textAlignVertical: "center",
                            paddingHorizontal: 5,
                            opacity: 0.5,
                            borderRadius: 16
                        }}>{priority}</Text>

                    </View>
                    <Text style={{ fontSize: 12, fontFamily: "Kavivanar", width: "80%" }}>{description}</Text>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={{ fontSize: 8, color: Colors.dark.secondary, textAlignVertical: "bottom", marginHorizontal: "auto" }}> {status == "ToDo" && "Double Tap to Complete"}</Text>
                        <View style={{ flexDirection: "row", gap: 25 }}>
                            <TouchableOpacity onPress={() => {
                                setEditTaskOpen({ isOpen: true, id })
                            }}>
                                {/* navigation.navigate('EditTask', { id }) */}
                                <FontAwesome6 name="pen-to-square" size={21} color={Colors.light.background2} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleTaskDelete}>
                                <Text ><Ionicons name="trash-bin" size={24} color={Colors.light.background2} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable >
    );
};

export default Task;


