import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useStatesContext } from '@/context/StatesProvider';
import { RootStackParamList } from '@/interfaces/types';
import { getDayEntries, TimelineEntry } from '@/db/timelineDb';
import { addMedia } from '@/db/mediaDb';
import { createNote } from '@/db/noteDb';
import { pickMedia } from '@/Utils/mediaImport';
import { addDays, formatDate, parseDate, MONTH_NAMES } from '@/Utils/helpFunctions';
import TimelineEntryRow from '@/components/timeline/timelineEntry';
import EmptyState from '@/components/emptyState/emptyState';
import Loader from '@/components/loader/loader';
import EditTaskScreen from '@/containers/editTask/editTask';
import EditNoteScreen from '@/containers/editNote/editNote';
import { DeletingPopUp } from '@/components/delete/deletingPopUp';
import CreateNote from '@/containers/editNote/createNote';

type Filter = 'All' | 'Tasks' | 'Notes' | 'ToDo';
const FILTERS: Filter[] = ['All', 'Tasks', 'Notes', 'ToDo'];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/** Horizontal travel, in px, that commits a day change. */
const SWIPE_THRESHOLD = 60;

const TimelineTab = () => {
    const { theme } = useThemeContext();
    const { day, setDay, dayNotes } = useGlobalContext();
    const { dbLoaded, editTaskOpen, editNoteOpen, deletingOpen, createNoteOpen, setCreateNoteOpen } = useStatesContext();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [filter, setFilter] = useState<Filter>('All');
    const [loading, setLoading] = useState(true);
    const [capturing, setCapturing] = useState(false);
    const [pickingDate, setPickingDate] = useState(false);

    const load = useCallback(async () => {
        if (!dbLoaded) return;
        setLoading(true);
        try {
            const result = await getDayEntries(day);
            setEntries(result.data ?? []);
        } finally {
            setLoading(false);
        }
    }, [day, dbLoaded]);

    // Reloads when the tab regains focus, so edits made in a modal show up.
    useFocusEffect(useCallback(() => { load(); }, [load]));

    useEffect(() => { load(); }, [dayNotes, load]);

    const goToDay = (offset: number) => {
        Haptics.selectionAsync().catch(() => { });
        setDay(addDays(day, offset));
    };

    // Swiping the day is the natural gesture for a diary; the arrow buttons
    // stay for discoverability.
    const swipe = Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-14, 14])
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) goToDay(-1);
            else if (event.translationX < -SWIPE_THRESHOLD) goToDay(1);
        })
        .runOnJS(true);

    /** Camera straight to a saved entry, the fastest path in a photo diary. */
    const quickCapture = async () => {
        setCapturing(true);
        try {
            const picked = await pickMedia('camera', { allowsMultipleSelection: false });

            if (picked.permissionDenied) {
                return Alert.alert('Camera access needed', 'You can grant it in your device settings.');
            }
            if (picked.media.length === 0) return;

            const note = await createNote({ id: '', title: '', message: '', isFavorite: 0, date: day });
            if (!note.success || !note.data) {
                return Alert.alert('Could not save', 'Something went wrong creating the entry.');
            }

            for (const item of picked.media) {
                await addMedia({ ...item, noteId: note.data });
            }

            await load();
        } finally {
            setCapturing(false);
        }
    };

    const visible = entries.filter((entry) => {
        if (filter === 'Tasks') return entry.kind === 'task';
        if (filter === 'Notes') return entry.kind === 'note';
        if (filter === 'ToDo') return entry.kind === 'task' && entry.status === 'ToDo';
        return true;
    });

    const parsed = parseDate(day);
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {editTaskOpen.isOpen && <EditTaskScreen />}
            {editNoteOpen.isOpen && <EditNoteScreen />}
            {deletingOpen.isOpen && <DeletingPopUp />}
            {createNoteOpen && (
                <View style={styles.composer}>
                    <CreateNote />
                </View>
            )}

            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View style={styles.headerTop}>
                    <Text style={styles.brand}>Diary</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={styles.iconButton}
                        accessibilityLabel="Settings"
                    >
                        <Ionicons name="settings-outline" size={26} color={styles.headerText.color} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.dateRow}
                    onPress={() => setPickingDate(true)}
                    accessibilityLabel="Jump to a date"
                >
                    <Text style={styles.dateBig}>
                        {WEEKDAYS[parsed.getDay()]} {parsed.getDate()}
                    </Text>
                    <Text style={styles.dateSmall}>
                        {MONTH_NAMES[parsed.getMonth()]} {parsed.getFullYear()}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={styles.headerText.color} style={styles.dateChevron} />
                </TouchableOpacity>
            </View>

            {pickingDate && (
                <DateTimePicker
                    value={parsed}
                    mode="date"
                    onChange={(event, selected) => {
                        setPickingDate(false);
                        if (event.type === 'set' && selected) setDay(formatDate(selected));
                    }}
                />
            )}

            <View style={styles.dayBar}>
                <TouchableOpacity onPress={() => goToDay(-1)} style={styles.dayButton} accessibilityLabel="Previous day">
                    <Ionicons name="chevron-back" size={20} color={styles.dayBarText.color} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDay(formatDate(new Date()))} style={styles.todayButton}>
                    <Text style={styles.dayBarText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => goToDay(1)} style={styles.dayButton} accessibilityLabel="Next day">
                    <Ionicons name="chevron-forward" size={20} color={styles.dayBarText.color} />
                </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
                {FILTERS.map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => setFilter(option)}
                        style={[styles.filterChip, filter === option && styles.filterChipOn]}
                    >
                        <Text style={[styles.filterText, filter === option && styles.filterTextOn]}>
                            {option === 'ToDo' ? 'To do' : option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <GestureDetector gesture={swipe}>
                <View style={styles.listWrapper}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <FlatList
                            data={visible}
                            keyExtractor={(item) => `${item.kind}-${item.id}`}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => <TimelineEntryRow entry={item} onChanged={load} />}
                            ListEmptyComponent={
                                <EmptyState
                                    icon="sunny-outline"
                                    title={filter === 'All' ? 'Nothing for this day' : `No ${filter === 'ToDo' ? 'pending tasks' : filter.toLowerCase()}`}
                                    hint={filter === 'All' ? 'Tap the camera to start, or swipe to another day.' : undefined}
                                />
                            }
                        />
                    )}
                </View>
            </GestureDetector>

            <View style={styles.fabColumn} pointerEvents="box-none">
                <TouchableOpacity
                    onPress={() => setCreateNoteOpen(true)}
                    style={styles.fabSmall}
                    accessibilityLabel="Write a note"
                >
                    <Ionicons name="create-outline" size={22} color={styles.headerText.color} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={quickCapture}
                    disabled={capturing}
                    style={[styles.fab, capturing && styles.fabBusy]}
                    accessibilityLabel="Take a photo"
                >
                    <Ionicons name="camera" size={28} color={Colors.text.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') => {
    const text = theme === 'light' ? Colors.text.textDark : Colors.text.textLight;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'light' ? Colors.light.background2 : Colors.dark.background,
        },
        header: {
            backgroundColor: theme === 'light' ? Colors.light.primary : Colors.dark.background2,
            paddingHorizontal: 18,
            paddingBottom: 12,
            gap: 6,
        },
        headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        headerText: { color: text },
        brand: { fontFamily: 'Pacifico', fontSize: 24, color: text },
        iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
        dateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingBottom: 4 },
        dateChevron: { paddingBottom: 7, opacity: 0.8 },
        dateBig: { fontFamily: 'Cagliostro', fontSize: 34, lineHeight: 38, color: text },
        dateSmall: { fontFamily: 'Kavivanar', fontSize: 14, paddingBottom: 5, color: text, opacity: 0.8 },
        dayBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingVertical: 6,
            backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.primary2,
        },
        dayButton: { width: 44, height: 40, alignItems: 'center', justifyContent: 'center' },
        todayButton: { paddingHorizontal: 18, paddingVertical: 9, minHeight: 44, justifyContent: 'center' },
        dayBarText: { fontFamily: 'Cagliostro', fontSize: 14, color: text },
        filterRow: { flexDirection: 'row', gap: 7, paddingHorizontal: 14, paddingVertical: 9 },
        filterChip: {
            paddingHorizontal: 13,
            paddingVertical: 7,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme === 'light' ? 'rgba(11,25,44,0.18)' : 'rgba(255,224,224,0.25)',
        },
        filterChipOn: {
            backgroundColor: theme === 'light' ? Colors.light.primary2 : Colors.dark.secondary2,
            borderColor: 'transparent',
        },
        filterText: { fontFamily: 'Kavivanar', fontSize: 12, color: text },
        filterTextOn: { color: Colors.text.textLight },
        listWrapper: { flex: 1 },
        listContent: { flexGrow: 1, paddingTop: 6, paddingBottom: 120 },
        composer: {
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 20,
        },
        fabColumn: { position: 'absolute', right: 18, bottom: 22, alignItems: 'center', gap: 10 },
        fabSmall: {
            width: 46,
            height: 46,
            borderRadius: 23,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'light' ? Colors.light.background2 : Colors.dark.ternary,
            elevation: 4,
        },
        fab: {
            width: 62,
            height: 62,
            borderRadius: 31,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'light' ? Colors.light.primary2 : Colors.dark.secondary2,
            elevation: 6,
        },
        fabBusy: { opacity: 0.6 },
    });
};

export default TimelineTab;
