import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';
import { NewNoteMedia } from '@/db/mediaDb';
import { toAbsoluteUri } from '@/Utils/mediaStorage';
import { pickMedia, PickSource } from '@/Utils/mediaImport';

/** An attachment that may not be saved to the database yet. */
export type DraftMedia = Omit<NewNoteMedia, 'noteId'> & { id?: string };

interface MediaStripProps {
    media: DraftMedia[];
    onAdd: (media: DraftMedia[]) => void;
    onRemove: (index: number) => void;
}

function formatDuration(ms: number | null): string | null {
    if (!ms) return null;
    const total = Math.round(ms / 1000);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * Horizontal row of attached photos and videos, with buttons to add more.
 * Used by both the create and the edit note screens.
 */
const MediaStrip: React.FC<MediaStripProps> = ({ media, onAdd, onRemove }) => {
    const { theme } = useThemeContext();
    const [busy, setBusy] = React.useState(false);
    const tint = theme === 'light' ? Colors.text.textDark : Colors.text.textLight;

    const handlePick = async (source: PickSource) => {
        setBusy(true);
        try {
            const result = await pickMedia(source);

            if (result.permissionDenied) {
                Alert.alert(
                    source === 'camera' ? 'Camera access needed' : 'Photo access needed',
                    'You can grant it in your device settings.',
                );
                return;
            }

            if (result.media.length) onAdd(result.media);
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                <TouchableOpacity
                    style={[styles.addButton, { borderColor: tint }]}
                    onPress={() => handlePick('camera')}
                    disabled={busy}
                    accessibilityLabel="Take a photo or video"
                >
                    <Ionicons name="camera-outline" size={26} color={tint} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.addButton, { borderColor: tint }]}
                    onPress={() => handlePick('library')}
                    disabled={busy}
                    accessibilityLabel="Add from library"
                >
                    <Ionicons name="images-outline" size={24} color={tint} />
                </TouchableOpacity>

                {media.map((item, index) => {
                    const duration = formatDuration(item.durationMs);

                    return (
                        <View key={item.id ?? `${item.path}-${index}`} style={styles.thumbWrapper}>
                            <Image
                                source={{ uri: toAbsoluteUri(item.thumbPath ?? item.path) }}
                                style={styles.thumb}
                                contentFit="cover"
                                transition={120}
                            />
                            {item.kind === 'video' && (
                                <View style={styles.videoBadge}>
                                    <Ionicons name="play" size={12} color="#fff" />
                                    {duration ? <Text style={styles.duration}>{duration}</Text> : null}
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemove(index)}
                                accessibilityLabel="Remove attachment"
                            >
                                <Ionicons name="close" size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const THUMB = 64;

const styles = StyleSheet.create({
    container: { marginTop: 8 },
    row: { gap: 8, paddingHorizontal: 10, alignItems: 'center' },
    addButton: {
        width: THUMB,
        height: THUMB,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbWrapper: { width: THUMB, height: THUMB },
    thumb: { width: THUMB, height: THUMB, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.08)' },
    videoBadge: {
        position: 'absolute',
        left: 4,
        bottom: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    duration: { color: '#fff', fontSize: 10 },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
});

export default MediaStrip;
