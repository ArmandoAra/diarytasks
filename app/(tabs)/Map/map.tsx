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
import { SafeAreaView } from 'react-native-safe-area-context';

interface SortedDataProps {
    date: string;
    allTasksCompleted: boolean;
    haveNote: boolean;
    day: string;
    month: string;
    year: string;
}

const fetchAllDaysWithData = async (setDaysWithData: React.Dispatch<React.SetStateAction<SortedDataProps[]>>) => {
    try {
        const result = await getSortedDaysWithNotesAndTasks();
        setDaysWithData(result)
    } catch (error) {
        console.log("Error fetching all Days with data and notes line 30 map.tsx")
    }
};

const MapTab = () => {
    const { setDay, day } = useGlobalContext();
    const [daysWithData, setDaysWithData] = useState<SortedDataProps[]>([]);
    const { setLoading } = useGlobalContext();
    const navigation = useNavigation<BottomTabNavProps>();

    const handleNavigate = (day: string) => {
        setDay(day)
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
            backgroundColor: Colors.light.secondary,
            color: Colors.light.background2
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light.primaryLight }}>
            <Text style={{
                color: Colors.light.background2, height: 100, width: "100%", backgroundColor: Colors.light.secondary, position: "absolute", elevation: 5,
                textAlign: "center", textAlignVertical: "center", fontSize: 20, fontFamily: "Pacifico", padding: 10, top: 0, zIndex: 1,
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
                        backgroundColor: Colors.light.secondary,
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
                            color: Colors.light.background2,
                            backgroundColor: Colors.light.secondary,
                        }}>
                            {year}
                        </Text>

                        {/* Meses */}
                        {Object.entries(months).map(([month, days]) => (
                            <View key={month} style={{
                                marginVertical: 1,
                                width: "100%",
                            }}>
                                {/* Nombre del Mes */}
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 30,
                                    fontFamily: "Cagliostro",
                                    color: Colors.light.background2,
                                    backgroundColor: Colors.light.secondary,
                                    paddingVertical: 5,
                                }}>
                                    {month}
                                </Text>

                                {/* Días ordenados */}
                                <View style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    width: "100%",
                                    backgroundColor: Colors.light.background,
                                    paddingVertical: 10
                                }}>
                                    {days
                                        .sort((a, b) => Number(a.day) - Number(b.day)) // Ordenar días
                                        .map(({ day, haveNote, allTasksCompleted }) => (
                                            <TouchableOpacity
                                                key={day}
                                                style={{
                                                    width: "12.5%",
                                                    backgroundColor: Colors.light.primary,
                                                    margin: 3,
                                                    borderRadius: 16,
                                                    elevation: 5
                                                }}
                                                onPress={() => {
                                                    handleNavigate(`${day.toString() + "-" + getMonthNumber(month)?.toString() + "-" + year.toString()}`)
                                                }}
                                            >
                                                {haveNote &&
                                                    <View style={{ right: 2, position: "absolute", bottom: 2 }}>
                                                        <FontAwesome name="sticky-note" size={14} color={Colors.light.primaryDark} /></View>}
                                                {allTasksCompleted && <View style={{ position: "absolute", top: 2, left: 2 }}>
                                                    <Feather name="check-circle" size={16} color="green" />
                                                </View>}
                                                <Text style={{
                                                    color: Colors.light.background,
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

