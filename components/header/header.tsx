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
import DayChangerContainer from '@/containers/dayChanger/dayChangerContainer';
import { useThemeContext } from '@/context/ThemeProvider';

const Header = () => {
    const { user, day, setDay } = useGlobalContext();
    const { theme } = useThemeContext();

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
        <View
            style={{
                height: 150,
                backgroundColor: theme == "light" ? Colors.light.secondary2 : Colors.dark.background
            }} >
            <View
                style={{
                    height: "70%",
                    paddingLeft: 30,
                    backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.primary2
                }} >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                    <Text
                        style={{
                            textAlignVertical: "bottom",
                            fontSize: 32,
                            fontFamily: "Pacifico",
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }} >
                        Diary Tasks
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={{
                            right: 40,
                            top: 30
                        }}>
                        <Text
                            style={{
                                color: theme == "light" ? Colors.text.textDark : Colors.text.textLight
                            }}>
                            <Ionicons name="settings-outline" size={34} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        textAlignVertical: "bottom",
                        fontSize: 20,
                        fontFamily: "Kavivanar",
                        color: Colors.text.textDark
                    }}>
                    {`Hi, ${user.name}`}
                </Text>
            </View>
            <DayChangerContainer />
        </View>
    )
};


export default Header;
