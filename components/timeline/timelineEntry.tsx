import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';
import { useStatesContext } from '@/context/StatesProvider';
import { TimelineEntry } from '@/db/timelineDb';
import { updateTaskStatus } from '@/db/taskDb';
import { priorityColorHandler } from '@/Utils/helpFunctions';
import MediaPreview from '../media/mediaPreview';
import MediaViewer from '../media/mediaViewer';
import Favorite from '../favoriteToggle/favToggle';

interface TimelineEntryRowProps {
    entry: TimelineEntry;
    /** Called after a write so the day can be reloaded. */
    onChanged: () => void;
}

/**
 * One row of the day: a task or a note, with the time in a left gutter.
 *
 * Tasks are completed by tapping the checkbox. The old card required a double
 * tap, which nothing on screen hinted at.
 */
const TimelineEntryRow: React.FC<TimelineEntryRowProps> = ({ entry, onChanged }) => {
    const { theme } = useThemeContext();
    const { setEditTaskOpen, setEditNoteOpen, setDeletingOpen } = useStatesContext();
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const styles = createStyles(theme);

    const toggleStatus = async () => {
        if (entry.kind !== 'task') return;

        const next = entry.status === 'ToDo' ? 'Completed' : 'ToDo';
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });

        const result = await updateTaskStatus(entry.id, next);
        if (!result.success) {
            Alert.alert('Could not save', 'Something went wrong updating the task.');
            return;
        }

        onChanged();
    };

    return (
        <View style={styles.row}>
            <Text style={styles.time}>{entry.time || '--:--'}</Text>

            {entry.kind === 'task' ? (
                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={toggleStatus}
                        style={styles.checkbox}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: entry.status === 'Completed' }}
                        accessibilityLabel={entry.title || entry.description}
                    >
                        {entry.status === 'Completed' ? (
                            <Ionicons name="checkmark-circle" size={24} color="#1F7A4D" />
                        ) : (
                            <View style={styles.checkboxEmpty} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.cardBody}>
                        {entry.title ? (
                            <Text
                                style={[styles.taskTitle, entry.status === 'Completed' && styles.done]}
                                numberOfLines={2}
                            >
                                {entry.title}
                            </Text>
                        ) : null}
                        <Text
                            style={[styles.taskText, entry.status === 'Completed' && styles.done]}
                            numberOfLines={3}
                        >
                            {entry.description}
                        </Text>
                    </View>

                    <View style={styles.cardSide}>
                        <Text style={[styles.priority, { backgroundColor: priorityColorHandler(entry.priority) }]}>
                            {entry.priority}
                        </Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => setEditTaskOpen({ isOpen: true, id: entry.id })}
                                accessibilityLabel="Edit task"
                                style={styles.actionButton}
                            >
                                <FontAwesome6 name="pen-to-square" size={15} color={styles.iconColor.color} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setDeletingOpen({ isOpen: true, id: entry.id, type: 'Task' })}
                                accessibilityLabel="Delete task"
                                style={styles.actionButton}
                            >
                                <Ionicons name="trash-bin" size={15} color={styles.iconColor.color} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.card}>
                    <View style={styles.cardBody}>
                        {entry.media.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setViewerIndex(0)}
                                accessibilityLabel={`Open ${entry.media.length} attachment${entry.media.length > 1 ? 's' : ''}`}
                            >
                                <MediaPreview media={entry.media} height={150} />
                            </TouchableOpacity>
                        )}
                        {entry.title ? <Text style={styles.noteTitle} numberOfLines={2}>{entry.title}</Text> : null}
                        {entry.message ? <Text style={styles.noteText}>{entry.message}</Text> : null}

                        <View style={styles.noteFooter}>
                            <Favorite id={entry.id} isFavorite={entry.isFavorite} />
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    onPress={() => setEditNoteOpen({ isOpen: true, id: entry.id })}
                                    accessibilityLabel="Edit note"
                                    style={styles.actionButton}
                                >
                                    <FontAwesome6 name="pen-to-square" size={15} color={styles.iconColor.color} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setDeletingOpen({ isOpen: true, id: entry.id, type: 'Note' })}
                                    accessibilityLabel="Delete note"
                                    style={styles.actionButton}
                                >
                                    <Ionicons name="trash-bin" size={15} color={styles.iconColor.color} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {viewerIndex !== null && (
                        <MediaViewer
                            media={entry.media}
                            initialIndex={viewerIndex}
                            onClose={() => setViewerIndex(null)}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') => {
    const text = theme === 'light' ? Colors.text.textDark : Colors.text.textLight;
    const muted = theme === 'light' ? '#5C6675' : '#B9AFAF';

    return StyleSheet.create({
        row: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, marginBottom: 12 },
        time: { width: 44, paddingTop: 12, fontFamily: 'Kavivanar', fontSize: 12, color: muted },
        card: {
            flex: 1,
            flexDirection: 'row',
            gap: 8,
            backgroundColor: theme === 'light' ? Colors.light.background2 : Colors.dark.ternary,
            borderRadius: 14,
            padding: 10,
            elevation: 2,
        },
        checkbox: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
        checkboxEmpty: {
            width: 21,
            height: 21,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: theme === 'light' ? Colors.light.secondary : Colors.dark.secondary,
        },
        cardBody: { flex: 1, gap: 2 },
        cardSide: { alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
        taskTitle: { fontFamily: 'Cagliostro', fontSize: 15, color: text },
        taskText: { fontFamily: 'Kavivanar', fontSize: 13, lineHeight: 19, color: text },
        done: { textDecorationLine: 'line-through', opacity: 0.55 },
        priority: {
            fontFamily: 'Kavivanar',
            fontSize: 10,
            color: Colors.text.textDark,
            borderRadius: 8,
            paddingHorizontal: 7,
            paddingVertical: 2,
            overflow: 'hidden',
        },
        noteTitle: { fontFamily: 'Cagliostro', fontSize: 16, color: text, marginTop: 2 },
        noteText: { fontFamily: 'Kavivanar', fontSize: 13, lineHeight: 20, color: text },
        noteFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        actions: { flexDirection: 'row', gap: 8 },
        actionButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'light' ? Colors.light.secondary : Colors.dark.secondary2,
        },
        iconColor: { color: text },
    });
};

export default TimelineEntryRow;
