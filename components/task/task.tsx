import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

// Interfaces
import { CreateTaskProps } from '../../interfaces/TasksInterfaces';

import { updateTaskStatus } from '@/db/taskDb';
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
    const { setTasks, tasks } = useGlobalContext();
    const { setEditTaskOpen, setDeletingOpen } = useStatesContext();
    const { theme } = useThemeContext();

    const [lastTap, setLastTap] = useState(0);
    const DOUBLE_TAP_DELAY = 300;

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            const newStatus = status === "ToDo" ? "Completed" : "ToDo";
            const tasksWithStatusChange: CreateTaskProps[] = tasks.map(task =>
                task.id === id ? { ...task, status: newStatus } : task
            );

            setTasks(tasksWithStatusChange);

            try {
                const response = await updateTaskStatus(id, newStatus);
                if (!response.success) {
                    alert('Something went wrong updating the task status');
                }
            } catch (error) {
                console.error("Error updating task status:", error);
                alert('Something went wrong updating the task status');
            }
        }
        setLastTap(now);
    };

    const styles = createStyles(theme as "light" || "Dark");

    return (
        <TouchableOpacity
            onPress={handleDoubleTap}
            style={styles.taskContainer}
        >
            {/* First Line */}
            <View style={styles.firstLine}>
                <View style={styles.firstLineStart}>
                    <Text>{StatusIcon(status)}</Text>
                    <Text style={styles.titleText}>
                        {title.toLocaleUpperCase()}
                    </Text>
                    <Text style={styles.dateText}>{date}</Text>
                </View>
                <Text style={[styles.priorityText, { backgroundColor: priorityColorHandler(priority) }]}>
                    {priority}
                </Text>
            </View>
            {/*Second Line  */}

            <Text style={styles.descriptionText}>{description}</Text>

            <View style={styles.lastLine}>
                <Text style={styles.doubleTapText}>
                    {status === "ToDo" ? "Double Tap to Complete" : ""}
                </Text>
                <View style={styles.lastLineEnd}>
                    <TouchableOpacity
                        onPress={() => setEditTaskOpen({ isOpen: true, id })}
                        style={styles.editButton}>
                        <FontAwesome6 name="pen-to-square" size={21} color={theme === "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDeletingOpen({ isOpen: true, id, type: "Task" })}
                        style={styles.deleteButton}>
                        <Ionicons name="trash-bin" size={24} color={theme === "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                </View>
            </View>

        </TouchableOpacity>

    );
};

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    taskContainer: {
        marginVertical: 5,
        padding: 5,
        borderRadius: 16,
        backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.ternary,
        elevation: 5
    },
    firstLine: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    firstLineStart: {
        flexDirection: "row",
        gap: 10
    },
    titleText: {
        fontFamily: "Kavivanar",
        color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        width: "50%",
    },
    dateText: {
        fontFamily: "Kavivanar",
        color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    priorityText: {
        fontFamily: "Kavivanar",
        color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
    },
    descriptionText: {
        padding: 5,
        fontFamily: "Kavivanar",
        color: theme === "light" ? Colors.text.textDark : Colors.text.textLight
    },
    lastLine: {
        flexDirection: "row"
    },
    doubleTapText: {
        textAlign: "center",
        width: "100%",
        fontFamily: "Kavivanar",
        fontSize: 10,
        opacity: 0.7,
        color: theme === "light" ? Colors.text.textDark : Colors.text.textLight
    },
    lastLineEnd: {
        flexDirection: "row",
        position: "absolute",
        right: 0,
        bottom: -10,
        gap: 10
    },
    editButton: {
        backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16
    },
    deleteButton: {
        backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16
    }
});

export default Task;