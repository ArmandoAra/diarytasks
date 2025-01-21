import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
// Styles
import { styles } from './styles';

// Interfaces
import { Task as TaskProps } from '../../interfaces/TasksInterfaces';

var importanceHighColor = "#590000";
var importanceMediumColor = "#767600";
var importanceLowColor = "#006400";



const Task = ({
    title,
    description,
    importanceLevel,
    onTaskEdit,
    onTaskDelete,
}: TaskProps) => {
    const [importanceColor, setImportanceColor] = useState<string>(importanceLowColor);

    useEffect(() => {
        switch (importanceLevel) {
            case "High":
                setImportanceColor(importanceHighColor);
                break;
            case "Medium":
                setImportanceColor(importanceMediumColor);
                break;
            case "Low":
                setImportanceColor(importanceLowColor);
                break;
        }
    }, []);

    return (
        <View style={styles.taskContainer}>
            <View style={styles.taskHeader}>
                <Text style={styles.title}>{title}</Text>

                {/* TODO: Debe ser dinamico el color del fondo del texto según su nivel de importancia */}
                <Text style={{ ...styles.importanceLevel, backgroundColor: importanceColor }}>{importanceLevel}</Text>

            </View>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.actionContainer}>
                <Text style={styles.actionTextHint}>Double Tap to Complete</Text>
                {/*TODO: Cuando se haga clic en la tarea, se abrirá una ventana para editarla. tomando el (Id) */}
                <TouchableOpacity onPress={onTaskEdit}>
                    {/*TODO: Reemplazar con el icono de edición pro un lapiz */}
                    <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>

                {/*TODO: Cuando se haga clic en la tarea, se eliminará la tarea. tomando el (Id) */}
                <TouchableOpacity onPress={onTaskDelete}>
                    {/*TODO: Reemplazar con el icono de eliminación pro un cesto de basura */}
                    <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default Task;
