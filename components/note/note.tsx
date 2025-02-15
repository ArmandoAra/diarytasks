import React, { Dispatch, SetStateAction } from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent, StyleSheet, ScrollView } from 'react-native'
import Svg, { Line } from 'react-native-svg';




//Interface
export interface NoteProps {
    id: string,
    title: string;
    message: string;
    isFavorite: number;
}

// Styles
import { styles } from './styles'
import Favorite from '../favoriteToggle/favToggle';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useStatesContext } from '@/context/StatesProvider';


const Note: React.FC<NoteProps> = ({ id, title, message, isFavorite }: NoteProps) => {
    const { setEditNoteOpen, setDeletingOpen } = useStatesContext();


    return (
        <View style={{ width: '46%', margin: 4, }}>
            <View style={{
                width: "100%",
                height: 172,
                borderRadius: 16,
                backgroundColor: Colors.light.primaryDark,
                marginHorizontal: 5,
                padding: 10,
                elevation: 5,
                shadowColor: 'rgba(0, 0, 0, 1)', // Para iOS
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                overflow: "hidden",
            }}>
                {/* Note Background */}
                <View style={stylesSvg.background}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Svg key={i} height="24" width="100%">
                            <Line
                                x1="0"
                                y1="19"
                                x2="100%"
                                y2="20"
                                stroke="rgba(8, 8, 9, 0.1)"
                                strokeWidth="1"
                            />
                        </Svg>
                    ))}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                    <Text style={{ fontFamily: "Cagliostro", fontSize: 16 }}>{title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Kavivanar", fontSize: 12, marginBottom: 12, lineHeight: 22.1, width: "85%" }} >{message}</Text>
                </View>
            </View>
            <View style={{
                gap: 20,
                position: "absolute",
                bottom: 0,
                right: -5,
                backgroundColor: "#D9A55C",
                height: "100%",
                width: "20%",
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                borderColor: "rgba(8, 8, 9, 0.1)",
                borderLeftWidth: 1,
                zIndex: 2,
            }}>
                <Favorite isFavorite={isFavorite} id={id} />

                <TouchableOpacity onPress={() => setEditNoteOpen({ isOpen: true, id })}>
                    <FontAwesome6 name="pen-to-square" size={24} color={Colors.dark.secondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeletingOpen({ isOpen: true, id, type: "Note" })}>
                    <Text ><Ionicons name="trash-bin" size={24} color={Colors.dark.secondary} /></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const stylesSvg = StyleSheet.create({
    container: {
        backgroundColor: '#FFFDE7', // Un color similar al papel
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

