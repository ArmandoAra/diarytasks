import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

import { NoteProps } from '@/interfaces/NotesInterfaces';
import Favorite from '../favoriteToggle/favToggle';
import { Colors } from '@/constants/Colors';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

const Note: React.FC<NoteProps> = ({ id, title, message, isFavorite }: NoteProps) => {
    const { setEditNoteOpen, setDeletingOpen } = useStatesContext();
    const { theme } = useThemeContext();

    const styles = createStyles(theme as "light" | "dark"); // Pass theme to createStyles


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={{
                    backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.ternary,
                    elevation: 6,
                    flex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Svg key={i} height="24" width="100%">
                            <Line
                                x1="0"
                                y1="19"
                                x2="100%"
                                y2="20"
                                stroke={theme === "light" ? "rgba(8, 8, 9, 0.1)" : "rgba(162, 160, 160, 0.5)"} // Use dynamic line color
                                strokeWidth="1"
                            />
                        </Svg>
                    ))}
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>

                <View style={styles.actions}>
                    <Favorite isFavorite={isFavorite} id={id} />
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setEditNoteOpen({ isOpen: true, id })}
                    >
                        <FontAwesome6 size={15} name="pen-to-square" color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setDeletingOpen({ isOpen: true, id, type: "Note" })}
                    >
                        <Ionicons name="trash-bin" size={18} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            width: '46%',
            margin: 4,
        },
        card: {
            width: "100%",
            height: 172,
            borderRadius: 16,
            backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.primary2,
            elevation: 5, // Android shadow
            shadowColor: 'rgba(0, 0, 0, 1)', // iOS shadow
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            overflow: "hidden",
        },
        content: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingTop: 16, // Adjust paddingTop based on title presence
        },
        title: {
            fontFamily: "Cagliostro",
            fontSize: 16,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        message: {
            fontFamily: "Kavivanar",
            fontSize: 12,
            lineHeight: 22.1,
            paddingHorizontal: 10,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            flex: 1, // Allow message to take up available space
            marginBottom: 12,
        },
        actions: {
            gap: 20,
            position: "absolute",
            bottom: 0,
            right: -5,
            height: "100%",
            width: "26%",
            alignItems: "center",
            justifyContent: "center",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderLeftWidth: 1,
            borderColor: "rgba(8, 8, 9, 0.1)", // Consistent border color
            zIndex: 2,
            backgroundColor: theme === "light" ? Colors.light.ternary : Colors.dark.ternary2,
        },
        actionButton: {
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
        },
        actionIconColor: {
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
    });


export default Note;