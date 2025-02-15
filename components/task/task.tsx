import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
} from 'react-native';
// Styles

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
import { useThemeContext } from '@/context/ThemeProvider';
import { useStatesContext } from '@/context/StatesProvider';

const Task = ({
    id,
    title,
    description,
    priority,
    date,
    status
}: CreateTaskProps) => {
    const { day, setTasks } = useGlobalContext();
    const { setEditTaskOpen, setDeletingOpen } = useStatesContext();
    const { theme } = useThemeContext();



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

    return (
        <Pressable
            onPress={handleDoubleTap}
            style={{
                marginVertical: 5,
                padding: 5,
                borderRadius: 16,
                backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.primary,
                elevation: 5
            }}
        >
            {/* First Line */}
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between"
                }} >
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <Text>{StatusIcon(status)}</Text>
                    <Text style={{
                        fontFamily: "Kavivanar",
                        color: theme == "light" ? Colors.text.textDark : Colors.text.textLight
                    }}>
                        {title.toLocaleUpperCase()}
                    </Text>
                </View>
                <Text
                    style={{
                        fontFamily: "Kavivanar",
                        color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        backgroundColor: priorityColorHandler(priority),
                    }}>
                    {priority}
                </Text>
            </View>
            {/*Second Line  */}

            <Text style={{
                padding: 5,
                fontFamily: "Kavivanar",
                color: theme == "light" ? Colors.text.textDark : Colors.text.textLight
            }}>{description}</Text>


            <View style={{ flexDirection: "row" }}>
                <Text
                    style={{
                        textAlign: "center",
                        width: "100%",
                        fontFamily: "Kavivanar",
                        fontSize: 10,
                        opacity: 0.7
                    }}>{status == "ToDo" && "Double Tap to Complete"}</Text>
                <View style={{ flexDirection: "row", position: "absolute", right: 0, bottom: -10, gap: 16 }}>
                    <TouchableOpacity
                        onPress={() => setEditTaskOpen({ isOpen: true, id })}
                        style={{
                            backgroundColor: theme == "light" ? Colors.light.primaryDark : Colors.dark.primaryLight,
                            width: 36,
                            height: 36,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 16
                        }}>
                        <FontAwesome6 name="pen-to-square" size={21} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setDeletingOpen({ isOpen: true, id, type: "Task" }
                            )
                        }}
                        style={{
                            backgroundColor: theme == "light" ? Colors.light.primaryDark : Colors.dark.primaryLight,
                            width: 36,
                            height: 36,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 16
                        }}>
                        <Text>
                            <Ionicons name="trash-bin" size={24} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Pressable>

    );
};

export default Task;


