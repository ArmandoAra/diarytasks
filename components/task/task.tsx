import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type Status = "ToDo" | "Completed";
export type ImportanceLevel = "Low" | "Medium" | "High";

export interface Task {
    title: string;
    description: string;
    status: Status;
    importanceLevel: ImportanceLevel;
    weekDays?: WeekDay[];
    dates?: Date[];
    dateStart?: Date;
    dateEnd?: Date;
    createdAt: Date;
    modifiedAt: Date;
    onEdit?: (event: GestureResponderEvent) => void;
    onDelete?: (event: GestureResponderEvent) => void;
}

const Task = ({
    title,
    description,
    importanceLevel,
    onEdit,
    onDelete,
}: Task) => {
    return (
        <View style={styles.taskContainer}>
            <View style={styles.taskHeader}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.importance}>
                    Importance:{" "}
                    <Text style={styles.importanceLevel}>{importanceLevel}</Text>
                </Text>
            </View>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={onEdit}>
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: "#1e293b", // slate-900
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    taskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    importance: {
        fontSize: 14,
        color: "#fff",
    },
    importanceLevel: {
        backgroundColor: "#f87171", // red-400
        borderRadius: 8,
        paddingHorizontal: 5,
        color: "#fff",
    },
    description: {
        fontSize: 14,
        color: "#cbd5e1", // slate-300
        marginTop: 8,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10, // Puedes usar márgenes si tu versión de RN no soporta gap
        marginTop: 8,
    },
    actionText: {
        fontSize: 14,
        color: "#60a5fa", // blue-400
        textDecorationLine: "underline",
    },
});

export default Task;
