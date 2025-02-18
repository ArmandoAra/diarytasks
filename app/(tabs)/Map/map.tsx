import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { BottomTabNavProps } from '@/interfaces/types';
import { getMonthNumber } from '@/Utils/helpFunctions';
import { getSortedDaysWithNotesAndTasks } from '@/db/mapDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '@/constants/Colors';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';

interface SortedDataProps {
    date: string;
    allTasksCompleted: boolean;
    haveTask: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}

const MapTab = () => {
    const { theme } = useThemeContext();
    const { setDay } = useGlobalContext();
    const { setLoading } = useStatesContext();
    const navigation = useNavigation<BottomTabNavProps>();

    const [daysWithData, setDaysWithData] = useState<SortedDataProps[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchAllDaysWithData = async () => {
                setLoading(true);
                try {
                    const result = await getSortedDaysWithNotesAndTasks();
                    if (Array.isArray(result)) {
                        setDaysWithData(result);
                    } else {
                        console.error("Data format error: Expected an array", result);
                        setDaysWithData([]);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllDaysWithData();
        }, [setLoading])
    );

    const handleNavigate = (day: string, haveTask: boolean) => {
        if (!day) return;
        setDay(day);
        navigation.navigate(haveTask ? "HomeTab" : "Notes");
    };

    const groupedByYearAndMonth = daysWithData.reduce((acc, data) => {
        if (!data.year || !data.month) return acc;
        const { year, month } = data;
        acc[year] = acc[year] || {};
        acc[year][month] = acc[year][month] || [];
        acc[year][month].push(data);
        return acc;
    }, {} as Record<string, Record<string, SortedDataProps[]>>);

    const styles = createStyles(theme as "light" | "dark");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MAP</Text>
            <ScrollView style={styles.scrollView}>
                {Object.entries(groupedByYearAndMonth).map(([year, months]) => (
                    <View key={year} style={styles.yearContainer}>
                        <Text style={styles.yearTitle}>{year}</Text>
                        {Object.entries(months).map(([month, days]) => (
                            <View key={month} style={styles.monthContainer}>
                                <Text style={styles.monthTitle}>{month}</Text>
                                <View style={styles.daysContainer}>
                                    {days
                                        .sort((a, b) => Number(a.day) - Number(b.day))
                                        .map(({ day, haveNote, allTasksCompleted, haveTask }) => (
                                            <TouchableOpacity
                                                key={day}
                                                style={styles.dayButton}
                                                onPress={() => handleNavigate(`${day}-${getMonthNumber(month)}-${year}`, haveTask)}
                                            >
                                                {haveNote && <FontAwesome name="sticky-note" size={14} color={Colors.light.ternary2}
                                                    style={{ position: "absolute", bottom: 0, right: 0 }} />}
                                                {allTasksCompleted && <Feather name="check-circle" size={16} color="green" style={{ position: "absolute", top: 0, left: 0 }} />}
                                                <Text style={styles.dayText}>{String(day)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.primary2,
        },
        title: {
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            height: 105,
            width: "100%",
            backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.background2,
            position: "absolute",
            elevation: 5,
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 20,
            fontFamily: "Pacifico",
            padding: 10,
            top: 0,
            zIndex: 1,
        },
        scrollView: {
            width: "100%",
            height: "100%",
            marginTop: 100,
        },
        yearContainer: {
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            width: "95%",
            margin: "auto",
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.primary2,
            borderRadius: 16,
            overflow: "hidden",
        },
        yearTitle: {
            width: "100%",
            textAlign: "center",
            height: 50,
            fontFamily: "Cagliostro",
            fontSize: 40,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        },
        monthContainer: {
            width: "100%",
        },
        monthTitle: {
            textAlign: "center",
            fontSize: 30,
            fontFamily: "Cagliostro",
            paddingVertical: 5,
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        },
        daysContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.secondary2,
            paddingVertical: 10,
        },
        dayButton: {
            height: 50,
            width: "12.5%",
            backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.ternary,
            margin: 3,
            borderRadius: 16,
            elevation: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dayText: {
            fontSize: 22,
            fontFamily: "Cagliostro",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
    });

export default MapTab;
