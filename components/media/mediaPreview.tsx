import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { NoteMedia } from '@/db/mediaDb';
import { toAbsoluteUri } from '@/Utils/mediaStorage';

interface MediaPreviewProps {
    media: NoteMedia[];
    height?: number;
}

/**
 * Cover image for a note card: the first attachment, with a count badge when
 * there are more. Always renders the thumbnail, never the original.
 */
const MediaPreview: React.FC<MediaPreviewProps> = ({ media, height = 84 }) => {
    if (media.length === 0) return null;

    const [cover] = media;

    return (
        <View style={[styles.container, { height }]}>
            <Image
                source={{ uri: toAbsoluteUri(cover.thumbPath ?? cover.path) }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={120}
            />
            {cover.kind === 'video' && (
                <View style={styles.play}>
                    <Ionicons name="play" size={14} color="#fff" />
                </View>
            )}
            {media.length > 1 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>+{media.length - 1}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginBottom: 6,
    },
    play: {
        position: 'absolute',
        left: 6,
        bottom: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    badge: {
        position: 'absolute',
        right: 6,
        bottom: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 9,
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});

export default MediaPreview;
