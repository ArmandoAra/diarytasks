import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { formatDate, getBackDay, getNextDay } from '@/Utils/helpFunctions';
import { useThemeContext } from '@/context/ThemeProvider';
import { useStatesContext } from '@/context/StatesProvider';

const DayChangerContainer = () => {
    const { day, setDay } = useGlobalContext();
    const { setLoading } = useStatesContext();
    const { theme } = useThemeContext();

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
        setLoading(true)
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
                flexDirection: "row",
                height: 45,
                paddingVertical: 5,
                paddingHorizontal: 10,
                justifyContent: "space-around",
                backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.background2
            }}>
            <TouchableOpacity
                onPress={() => setOpen(true)} >
                <Text style={{
                    width: 100,
                    height: "100%",
                    fontFamily: "Cagliostro",
                    textAlign: "center",
                    textAlignVertical: "center",
                    borderBottomWidth: 2,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderRadius: 16,
                    borderColor: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                }}>
                    Selecte Day
                </Text>

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
            <View
                style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                <TouchableOpacity onPress={() => handleDayNavigate("back")} style={{
                    width: 40,
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderRadius: 16,
                    borderColor: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                }}>
                    <Ionicons name="arrow-undo-outline" size={24} color={theme == "light" ? "black" : "white"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDayNavigate("today")}
                    style={{
                        width: 70,
                        alignItems: "center",
                        borderColor: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16
                    }}>
                    <Text
                        style={{
                            fontFamily: "Cagliostro",
                            margin: "auto",
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }}>
                        Today
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDayNavigate("next")}
                    style={{
                        width: 40,
                        alignItems: "center",
                        borderBottomWidth: 2,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderRadius: 16,
                        borderColor: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                    }}>
                    <Ionicons name="arrow-redo-outline" size={24} color={theme == "light" ? "black" : "white"} />
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default DayChangerContainer;
