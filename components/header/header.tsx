import { useGlobalContext } from '@/context/GlobalProvider';
import React, { useState } from 'react'
import { View, Text, Button } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates'; //Cambiar por npm i react-native-date-picker

import styles from '../../styles/homeStyles';
import { Button as PickerButton } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

// utils
import { formatDate, formatDateToString, getBackDay, getNextDay } from '@/Utils/helpFunctions';

const Header = () => {
    const { user, day, setDay } = useGlobalContext();

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
        <View style={styles.greetingContainer}>
            <Text style={styles.title} className='bg-orange-800'>Diary Tasks</Text>
            <Text style={styles.greeting}>Hi {user ? user : "Unknow"},</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{formatDateToString(day)}</Text>
                {/* Botón Select Day */}
                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', flexDirection: "row", gap: 5 }}>
                    <PickerButton onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                        Select Day
                    </PickerButton>
                    <DatePickerModal
                        saveLabel='Go to'
                        locale="en"
                        mode="single"
                        visible={open}
                        onDismiss={onDismiss}
                        date={date}
                        onConfirm={onConfirm}
                    />
                    <PickerButton onPress={() => handleDayNavigate("back")} uppercase={false} mode="outlined">
                        ⬅️
                    </PickerButton>
                    <PickerButton onPress={() => handleDayNavigate("today")} uppercase={false} mode="outlined">
                        Today
                    </PickerButton>
                    <PickerButton onPress={() => handleDayNavigate("next")} uppercase={false} mode="outlined">
                        ➡️
                    </PickerButton>


                </View>
            </View>
        </View>
    )
}

export default Header;
