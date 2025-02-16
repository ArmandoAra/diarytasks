import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

//expo
import { useFocusEffect } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

//interfaces
import { BottomTabNavProps } from '@/interfaces/types'
// Functions
import { getMonthNumber } from '@/Utils/helpFunctions';

//DB
import { getSortedDaysWithNotesAndTasks } from '@/db/mapDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '@/constants/Colors';
import { useStatesContext } from '@/context/StatesProvider';
import { ThemeProvider, useThemeContext } from '@/context/ThemeProvider';

interface SortedDataProps {
    date: string;
    allTasksCompleted: boolean;
    haveTask: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}

const fetchAllDaysWithData = async (setDaysWithData: React.Dispatch<React.SetStateAction<SortedDataProps[]>>) => {
    try {
        const result = await getSortedDaysWithNotesAndTasks();
        setDaysWithData(result);
    } catch (error) {
        console.log("Error fetching all Days with data and notes line 30 map.tsx")
    }
};

const MapTab = () => {
    const { theme } = useThemeContext();
    const { setDay } = useGlobalContext();

    const [daysWithData, setDaysWithData] = useState<SortedDataProps[]>([]);
    const { setLoading } = useStatesContext();
    const navigation = useNavigation<BottomTabNavProps>();

    const handleNavigate = (day: string, haveTask: boolean) => {
        setDay(day)
        if (!haveTask) return navigation.navigate("Notes");
        navigation.navigate("HomeTab")
    }

    useFocusEffect(
        useCallback(() => {
            fetchAllDaysWithData(setDaysWithData).then(() => setLoading(false));
        }, [])
    );

    if (!daysWithData || daysWithData.length === 0) {
        return <Text style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 30,
            fontFamily: "Pacifico",
            flex: 1,
            backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.background2,
            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight
        }}>
            No data available
        </Text>;
    }

    const groupedByYearAndMonth = daysWithData.reduce((acc, data) => {
        const { year, month } = data;

        if (!acc[year]) {
            acc[year] = {};
        }
        if (!acc[year][month]) {
            acc[year][month] = [];
        }

        acc[year][month].push(data);
        return acc;
    }, {} as Record<string, Record<string, typeof daysWithData>>);



    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme == "light" ? Colors.light.background2 : Colors.dark.primary2,
            }}>
            <Text
                style={{
                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                    height: 105,
                    width: "100%",
                    backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.background2,
                    position: "absolute",
                    elevation: 5,
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 20,
                    fontFamily: "Pacifico",
                    padding: 10,
                    top: 0,
                    zIndex: 1,
                }}>MAP</Text>
            <ScrollView style={{ width: "100%", height: "100%", marginTop: 100 }}>
                {Object.entries(groupedByYearAndMonth).map(([year, months]) => (
                    <View key={year} style={{
                        flexDirection: "column",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        marginHorizontal: "auto",
                        width: "95%",
                        backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.primary2,
                        borderRadius: 16,
                        overflow: "hidden",
                    }}>
                        {/* Año */}
                        <Text style={{
                            width: "100%",
                            textAlign: "center",
                            height: 50,
                            fontFamily: "Cagliostro",
                            fontSize: 40,
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                            backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary2,
                        }}>
                            {year}
                        </Text>

                        {/* Meses */}
                        {Object.entries(months).map(([month, days]) => (
                            <View key={month} style={{
                                width: "100%",
                            }}>
                                {/* Nombre del Mes */}
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 30,
                                    fontFamily: "Cagliostro",
                                    paddingVertical: 5,
                                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                                    backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary2,
                                }}>
                                    {month}
                                </Text>

                                {/* Días ordenados */}
                                <View style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    width: "100%",
                                    backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.secondary2,
                                    paddingVertical: 10
                                }}>
                                    {days
                                        .sort((a, b) => Number(a.day) - Number(b.day)) // Ordenar días
                                        .map(({ day, haveNote, allTasksCompleted, haveTask }) => (
                                            <TouchableOpacity
                                                key={day}
                                                style={{
                                                    width: "12.5%",
                                                    backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.ternary2,
                                                    margin: 3,
                                                    borderRadius: 16,
                                                    elevation: 5
                                                }}
                                                onPress={() => {
                                                    handleNavigate(`${day.toString() + "-" + getMonthNumber(month)?.toString() + "-" + year.toString()}`, haveTask)
                                                }}
                                            >
                                                {haveNote &&
                                                    <View style={{ right: 2, position: "absolute", bottom: 2 }}>
                                                        <FontAwesome name="sticky-note" size={14} color={Colors.light.ternary2} /></View>}
                                                {allTasksCompleted && <View style={{ position: "absolute", top: 2, left: 2 }}>
                                                    <Feather name="check-circle" size={16} color="green" />
                                                </View>}
                                                <Text style={{
                                                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                                                    fontSize: 30,
                                                    fontFamily: "Pacifico",
                                                    textAlign: "center",
                                                    textAlignVertical: "center",
                                                    paddingVertical: 2,
                                                    lineHeight: 50,
                                                }}>
                                                    {day}
                                                </Text>
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
}

export default MapTab;

