import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

import { deleteTaskById } from '@/db/taskDb';
import { deleteNoteById } from '@/db/noteDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { set } from 'astro:schema';

interface DeletingPopUpProps { } // Define props if needed

export const DeletingPopUp: React.FC<DeletingPopUpProps> = () => {
    const { theme } = useThemeContext();
    const { dayNotes, setDayNotes, tasks, setTasks } = useGlobalContext();
    const { deletingOpen, setDeletingOpen, setLoading } = useStatesContext();

    const handleDeleteById = async (id: string) => {
        try {
            switch (deletingOpen.type) {
                case "Task":
                    await deleteTaskById(id);
                    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); //remove task from tasks state array
                    break;
                case "Note":
                    await deleteNoteById(id);
                    setDayNotes((prevDayNotes) => prevDayNotes.filter((note) => note.id !== id)); //remove note from dayNotes state array
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error deleting ${deletingOpen.type}:`, error); // More specific error message
            // Consider showing an error message to the user
        }
        setDeletingOpen({ isOpen: false, id: "", type: null });

    };

    const styles = createStyles(theme as "light" | "dark");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deleting...</Text>
            <Text style={styles.message}>
                Do you really want to delete this {deletingOpen.type}?
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setDeletingOpen({ isOpen: false, id: "", type: null })}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteById(deletingOpen.id)}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            height: "25%",
            width: "90%",
            position: "absolute",
            top: 250,
            left: 20,
            gap: 10,
            padding: 10,
            borderRadius: 16,
            justifyContent: "center",
            backgroundColor: theme === "light" ? Colors.light.primary2 : Colors.dark.primary2,
            zIndex: 100,
        },
        title: {
            fontFamily: "Kavivanar",
            fontSize: 30,
            textAlign: "center",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        message: {
            fontFamily: "Kavivanar",
            fontSize: 15,
            textAlign: "center",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            height: 50,
            alignItems: "center",
        },
        cancelButton: {
            width: 90,
            height: 40,
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.background2,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        deleteButton: {
            width: 90,
            height: 40,
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.background2,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: "Cagliostro",
            textAlign: "center",
            fontSize: 20,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
    });