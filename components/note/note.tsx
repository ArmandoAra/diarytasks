import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Svg, { Line } from 'react-native-svg';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

//Interface
import { NoteProps } from '@/interfaces/NotesInterfaces';

// Styles
import Favorite from '../favoriteToggle/favToggle';
import { Colors } from '@/constants/Colors';

import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';


const Note: React.FC<NoteProps> = ({ id, title, message, isFavorite }: NoteProps) => {
    const { setEditNoteOpen, setDeletingOpen } = useStatesContext();
    const { theme } = useThemeContext();

    return (
        <View style={{ width: '46%', margin: 4, }}>
            <View style={{
                width: "100%",
                height: 172,
                borderRadius: 16,
                backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.primary2,
                marginHorizontal: 5,
                elevation: 5,
                shadowColor: 'rgba(0, 0, 0, 1)', // Para iOS
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                overflow: "hidden",
            }}>

                {/* Note Background */}
                <View style={[stylesSvg.background, { backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.ternary }]}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Svg key={i} height="24" width="100%">
                            <Line
                                x1="0"
                                y1="19"
                                x2="100%"
                                y2="20"
                                stroke={theme == "light" ? "rgba(8, 8, 9, 0.1)" : "rgba(162, 160, 160, 0.5)"}
                                strokeWidth="1"
                            />
                        </Svg>
                    ))}
                </View>

                {/* Note Content */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }} >
                    <Text
                        style={{
                            fontFamily: "Cagliostro",
                            fontSize: 16,
                            paddingLeft: 10,
                            paddingTop: title ? 16 : 0,
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}>
                        {title}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1
                    }}>
                    <Text
                        style={{
                            fontFamily: "Kavivanar",
                            fontSize: 12,
                            marginBottom: 12,
                            lineHeight: 22.1,
                            paddingHorizontal: 10,
                            width: "85%",
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }} >
                        {message}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    gap: 20,
                    position: "absolute",
                    bottom: 0,
                    right: -5,
                    height: "100%",
                    width: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    borderColor: "rgba(8, 8, 9, 0.1)",
                    borderLeftWidth: 1,
                    zIndex: 2,
                    backgroundColor: theme == "light" ? Colors.light.ternary : Colors.dark.ternary2,
                }}>
                <Favorite isFavorite={isFavorite} id={id} />

                <TouchableOpacity
                    style={{
                        backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary2,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 16
                    }} onPress={() => setEditNoteOpen({ isOpen: true, id })}>
                    <Text>
                        <FontAwesome6 size={15} name="pen-to-square" color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary2,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 16
                    }} onPress={() => setDeletingOpen({ isOpen: true, id, type: "Note" })}>
                    <Text >
                        <Ionicons name="trash-bin" size={18} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const stylesSvg = StyleSheet.create({
    container: {
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    background: {
        elevation: 6, // Para Android
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

export default Note;

