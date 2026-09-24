import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoteMedia } from '@/db/mediaDb';
import { toAbsoluteUri } from '@/Utils/mediaStorage';

interface MediaViewerProps {
    media: NoteMedia[];
    /** Index to open on; `null` keeps the viewer closed. */
    initialIndex: number | null;
    onClose: () => void;
}

const VideoPage: React.FC<{ uri: string; width: number; height: number }> = ({ uri, width, height }) => {
    const player = useVideoPlayer(uri, (p) => {
        p.loop = false;
    });

    return <VideoView player={player} style={{ width, height }} contentFit="contain" nativeControls />;
};

/** Full-screen, swipeable viewer for a note's attachments. */
const MediaViewer: React.FC<MediaViewerProps> = ({ media, initialIndex, onClose }) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const visible = initialIndex !== null;

    return (
        <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
            <View style={styles.container}>
                <FlatList
                    data={media}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={initialIndex ?? 0}
                    getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                    keyExtractor={(item) => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) =>
                        item.kind === 'video' ? (
                            <VideoPage uri={toAbsoluteUri(item.path)} width={width} height={height} />
                        ) : (
                            <Image
                                source={{ uri: toAbsoluteUri(item.path) }}
                                style={{ width, height }}
                                contentFit="contain"
                                transition={150}
                            />
                        )
                    }
                />
                <TouchableOpacity
                    style={[styles.close, { top: insets.top + 10 }]}
                    onPress={onClose}
                    accessibilityLabel="Close"
                >
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    close: {
        position: 'absolute',
        right: 16,
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
});

export default MediaViewer;
