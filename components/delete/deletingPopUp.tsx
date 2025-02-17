import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Colors } from "@/constants/Colors";

import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

import { deleteTaskById } from '@/db/taskDb';
import { deleteNoteById } from '@/db/noteDb';


// Handle the deletion of a task or note
export const DeletingPopUp = () => {
    const { theme } = useThemeContext();
    const { deletingOpen, setDeletingOpen, setLoading } = useStatesContext();

    const handleDeleteById = async (id: string) => {
        setLoading(true);
        switch (deletingOpen.type) {
            case "Task":
                try {
                    await deleteTaskById(id).then(() => {
                    }
                    );
                } catch (error) {
                }
                break;
            case "Note":
                try {
                    await deleteNoteById(id)
                } catch (error) {
                    console.log('Error deleting Note:', error);
                }
                break;
            default:
                break;
        }
        setDeletingOpen({ isOpen: false, id: "", type: null });
    }

    return (
        <View style={{
            height: "25%",
            paddingVertical: 3,
            width: "90%",
            position: "absolute",
            top: 250,
            left: 20,
            gap: 10,
            padding: 10,
            borderRadius: 16,
            justifyContent: "center",
            backgroundColor: theme == "light" ? Colors.light.primary2 : Colors.dark.primary2,
            zIndex: 100,
        }}>
            <Text
                style={{
                    fontFamily: "Kavivanar",
                    fontSize: 30,
                    textAlign: "center",
                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                }}>
                Deleting...
            </Text>
            <Text
                style={{
                    fontFamily: "Kavivanar",
                    fontSize: 15,
                    textAlign: "center",
                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                }}>
                Do you really want to delete this {deletingOpen.type}?
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: 50,
                    alignItems: "center"
                }}>
                <TouchableOpacity
                    style={{
                        width: 90,
                        height: 40,
                        backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.background2,
                        borderRadius: 16
                    }}
                    onPress={() => setDeletingOpen({ isOpen: false, id: "", type: null })}>
                    <Text
                        style={{
                            fontFamily: "Cagliostro",
                            textAlign: "center",
                            marginVertical: "auto",
                            fontSize: 20,
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: 90,
                        height: 40,
                        backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.background2,
                        borderRadius: 16
                    }}
                    onPress={() => handleDeleteById(deletingOpen.id)}>
                    <Text
                        style={{
                            fontFamily: "Cagliostro",
                            textAlign: "center",
                            marginVertical: "auto",
                            fontSize: 20,
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
