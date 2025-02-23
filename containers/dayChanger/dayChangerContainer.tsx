import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { formatDate, getBackDay, getNextDay } from '@/Utils/helpFunctions';
import { useThemeContext } from '@/context/ThemeProvider';
import { useStatesContext } from '@/context/StatesProvider';

interface DayChangerContainerProps { }

const DayChangerContainer: React.FC<DayChangerContainerProps> = () => {
    const { day, setDay } = useGlobalContext();
    const { setLoading } = useStatesContext();
    const { theme } = useThemeContext();

    const [date, setDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);

    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback((params: any) => {  // Type the params if possible
        setOpen(false);
        setDay(formatDate(params.date));
    }, [setDay]); // Add setDay to dependency array

    const handleDayNavigate = (to: "back" | "today" | "next") => {
        setLoading(true);
        try {
            switch (to) {
                case "back":
                    setDay(getBackDay(day));
                    break;
                case "today":
                    setDay(formatDate(new Date()));
                    break;
                case "next":
                    setDay(getNextDay(day));
                    break;
                default:
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = createStyles(theme as "light" | "dark");

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setOpen(true)} style={styles.selectDayButton}>
                <Text style={styles.selectDayText}>Select Day</Text>
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
            <View style={styles.navigationButtons}>
                <TouchableOpacity onPress={() => handleDayNavigate("back")} style={styles.navigationButton}>
                    <Ionicons name="arrow-undo-outline" size={24} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDayNavigate("today")} style={styles.todayButton}>
                    <Text style={styles.todayText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDayNavigate("next")} style={styles.navigationButton}>
                    <Ionicons name="arrow-redo-outline" size={24} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            height: 45,
            paddingVertical: 5,
            paddingHorizontal: 10,
            justifyContent: "space-around",
            backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background2,
        },
        selectDayButton: {
            width: 100,
            height: "100%",
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderRadius: 16,
            borderColor: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        selectDayText: {
            fontFamily: "Cagliostro",
            textAlign: "center",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        navigationButtons: {
            flexDirection: "row",
            gap: 10,
        },
        navigationButton: {
            width: 40,
            alignItems: "center",
            justifyContent: 'center',
            borderBottomWidth: 2,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderRadius: 16,
            borderColor: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        todayButton: {
            width: 70,
            alignItems: "center",
            justifyContent: 'center',
            borderColor: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            borderBottomWidth: 2,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderRadius: 16,
        },
        todayText: {
            fontFamily: "Cagliostro",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        navigationIconColor: {
            color: theme === "light" ? "black" : "white",
        },
    });

export default DayChangerContainer;