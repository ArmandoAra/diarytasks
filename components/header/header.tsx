import { useGlobalContext } from '@/context/GlobalProvider';
import React, { useState } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates'; //Cambiar por npm i react-native-date-picker


import { Button as PickerButton } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

// utils
import { formatDate, formatDateToString, getBackDay, getNextDay } from '@/Utils/helpFunctions';
import { Colors } from '@/constants/Colors';
import ThemedText from '@/Theme/themedText/text';

// Icons
import Ionicons from '@expo/vector-icons/Ionicons';

//Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/interfaces/types'; // Importa el tipo de rutas

const Header = () => {
    const { user, day, setDay, setSettingsOpen } = useGlobalContext();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    //Single Date Picker
    const [date, setDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);


    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback((params: any) => {
        setOpen(false);
        setDay(formatDate(params.date));
    }, []);

    const handleDayNavigate = (to: "back" | "today" | "next") => {
        switch (to) {
            case "back":
                let backDay = getBackDay(day);
                setDay(backDay)
                break;
            case "today":
                setDay(formatDate(new Date()));
                break;
            case "next":
                let nextDay = getNextDay(day)
                setDay(nextDay);
                break;

            default:
                break;
        }
    }


    return (
        <View style={{ height: "20%" }}>
            <View style={{ height: "67%", paddingLeft: 30, backgroundColor: Colors.light.primary, }} >
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                    <Text style={{ textAlignVertical: "bottom", fontSize: 32, fontFamily: "Pacifico", color: Colors.text.textDark }} >Diary Tasks</Text>
                    <TouchableOpacity style={{ right: 40, top: 30 }} onPress={() => navigation.navigate('Settings')}>
                        <Text style={{ color: Colors.text.textDark }}>
                            <Ionicons name="settings-outline" size={34} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ textAlignVertical: "bottom", fontSize: 20, fontFamily: "Kavivanar", color: Colors.text.textDark }}>{`Hi, ${user.name}`}</Text>

            </View>


            {/* Botón Select Day */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10, height: "20%", marginVertical: 10 }}>
                <TouchableOpacity onPress={() => setOpen(true)} >
                    <Text style={{
                        fontFamily: "Cagliostro",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 100,
                        height: "100%",
                        borderColor: Colors.text.textDark,
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16,
                        color: Colors.text.textDark
                    }}>Selecte Day</Text>

                </TouchableOpacity>
                <DatePickerModal
                    saveLabel='Go to'
                    locale="en"
                    mode="single"
                    visible={open}
                    onDismiss={onDismiss}
                    date={date}
                    onConfirm={onConfirm}
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity onPress={() => handleDayNavigate("back")} style={{
                        width: 40,
                        alignItems: "center",
                        borderColor: Colors.text.textDark,
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16
                    }}>
                        <Ionicons name="arrow-undo-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDayNavigate("today")} style={{
                        width: 70,
                        alignItems: "center",
                        borderColor: Colors.text.textDark,
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16
                    }}>
                        <Text style={{ fontFamily: "Cagliostro", margin: "auto", color: Colors.text.textDark }}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDayNavigate("next")} style={{
                        width: 40,
                        alignItems: "center",
                        borderColor: Colors.text.textDark,
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16
                    }}>
                        <Ionicons name="arrow-redo-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Header;
