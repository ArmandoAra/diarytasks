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
import { getSortedDaysWithNotesAndTasks } from '@/db/mapDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '@/constants/Colors';
import { useStatesContext } from '@/context/StatesProvider';
import { useThemeContext } from '@/context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from '@/components/emptyState/emptyState';
import { Image } from 'expo-image';
import { getDayCovers } from '@/db/mediaDb';
import { toAbsoluteUri } from '@/Utils/mediaStorage';

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
    const insets = useSafeAreaInsets();

    const [daysWithData, setDaysWithData] = useState<SortedDataProps[]>([]);
    const [covers, setCovers] = useState<Record<string, string>>({});

    useFocusEffect(
        useCallback(() => {
            const fetchAllDaysWithData = async () => {
                setLoading(true);
                try {
                    const [result, dayCovers] = await Promise.all([
                        getSortedDaysWithNotesAndTasks(),
                        getDayCovers(),
                    ]);
                    setCovers(dayCovers.data ?? {});
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

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { paddingTop: insets.top + 10 }]}>MAP</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {daysWithData.length === 0 && (
                    <EmptyState
                        icon="calendar-outline"
                        title="Nothing recorded yet"
                        hint="Days with tasks or notes will show up here."
                    />
                )}
                {Object.entries(groupedByYearAndMonth).map(([year, months]) => (
                    <View key={year} style={styles.yearContainer}>
                        <Text style={styles.yearTitle}>{year}</Text>
                        {Object.entries(months).map(([month, days]) => (
                            <View key={month} style={styles.monthContainer}>
                                <Text style={styles.monthTitle}>{month}</Text>
                                <View style={styles.daysContainer}>
                                    {[...days]
                                        .sort((a, b) => Number(a.day) - Number(b.day))
                                        .map(({ date, day, haveNote, allTasksCompleted, haveTask }) => (
                                            <TouchableOpacity
                                                key={date}
                                                style={styles.dayButton}
                                                onPress={() => handleNavigate(date, haveTask)}
                                                accessibilityLabel={`Open ${date}`}
                                            >
                                                {covers[date] ? (
                                                    <Image
                                                        source={{ uri: toAbsoluteUri(covers[date]) }}
                                                        style={styles.dayCover}
                                                        contentFit="cover"
                                                        transition={100}
                                                    />
                                                ) : null}
                                                {haveNote && !covers[date] && <FontAwesome name="sticky-note" size={14} color={Colors.light.ternary2}
                                                    style={{ position: "absolute", bottom: 2, right: 2 }} />}
                                                {allTasksCompleted && <Feather name="check-circle" size={16} color="green" style={{ position: "absolute", top: 2, left: 2 }} />}
                                                <Text style={[styles.dayText, covers[date] ? styles.dayTextOnCover : null]}>{String(day)}</Text>
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
            backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.primary2,
        },
        title: {
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            paddingBottom: 14,
            width: "100%",
            backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.background2,
            elevation: 5,
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 20,
            fontFamily: "Pacifico",
            padding: 10,
            zIndex: 1,
        },
        scrollView: {
            width: "100%",
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingBottom: 20,
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
        dayCover: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 16,
        },
        dayTextOnCover: {
            color: "#FFFFFF",
            // The cover can be any colour, so the number needs its own contrast.
            textShadowColor: "rgba(0,0,0,0.85)",
            textShadowRadius: 4,
            textShadowOffset: { width: 0, height: 1 },
        },
        dayText: {
            fontSize: 22,
            fontFamily: "Cagliostro",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
    });

export default MapTab;
