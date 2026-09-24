import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';
import { useGlobalContext } from '@/context/GlobalProvider';
import { BottomTabNavProps } from '@/interfaces/types';
import { DatedMedia, getFavouriteMedia, getGalleryMedia, getOnThisDay, Memory } from '@/db/mediaDb';
import { toAbsoluteUri } from '@/Utils/mediaStorage';
import { formatDate, MONTH_NAMES, parseDate, splitDate } from '@/Utils/helpFunctions';
import MediaViewer from '@/components/media/mediaViewer';
import EmptyState from '@/components/emptyState/emptyState';
import Loader from '@/components/loader/loader';

type Filter = 'All' | 'Photos' | 'Videos' | 'Favourites';
const FILTERS: Filter[] = ['All', 'Photos', 'Videos', 'Favourites'];

interface Section {
    title: string;
    data: DatedMedia[][];
}

const COLUMNS = 3;

/** Groups media into month sections, each holding rows of `COLUMNS` items. */
function toSections(media: DatedMedia[]): Section[] {
    const byMonth = new Map<string, DatedMedia[]>();

    for (const item of media) {
        const { year, month } = splitDate(item.date);
        const key = `${year}-${month}`;
        const bucket = byMonth.get(key);
        if (bucket) bucket.push(item);
        else byMonth.set(key, [item]);
    }

    return Array.from(byMonth, ([key, items]) => {
        const [year, month] = key.split('-');
        const rows: DatedMedia[][] = [];
        for (let i = 0; i < items.length; i += COLUMNS) rows.push(items.slice(i, i + COLUMNS));

        return { title: `${MONTH_NAMES[Number(month) - 1] ?? ''} ${year}`, data: rows };
    });
}

const GalleryTab = () => {
    const { theme } = useThemeContext();
    const { setDay } = useGlobalContext();
    const navigation = useNavigation<BottomTabNavProps>();
    const insets = useSafeAreaInsets();

    const [media, setMedia] = useState<DatedMedia[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [filter, setFilter] = useState<Filter>('All');
    const [loading, setLoading] = useState(true);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const result = filter === 'Favourites' ? await getFavouriteMedia() : await getGalleryMedia();
            let items = result.data ?? [];

            if (filter === 'Photos') items = items.filter((item) => item.kind === 'image');
            if (filter === 'Videos') items = items.filter((item) => item.kind === 'video');

            setMedia(items);

            const today = await getOnThisDay(formatDate(new Date()));
            setMemories(today.data ?? []);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const openMemory = (memory: Memory) => {
        setDay(memory.date);
        navigation.navigate('Timeline');
    };

    const styles = createStyles(theme);
    const sections = toSections(media);

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.headerTitle}>Gallery</Text>
            </View>

            {loading ? (
                <Loader />
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(row) => row.map((item) => item.id).join('-')}
                    stickySectionHeadersEnabled={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View>
                            {memories.map((memory) => (
                                <TouchableOpacity
                                    key={memory.date}
                                    style={styles.memory}
                                    onPress={() => openMemory(memory)}
                                >
                                    {memory.cover ? (
                                        <Image
                                            source={{ uri: toAbsoluteUri(memory.cover) }}
                                            style={styles.memoryCover}
                                            contentFit="cover"
                                            transition={120}
                                        />
                                    ) : (
                                        <View style={[styles.memoryCover, styles.memoryCoverEmpty]}>
                                            <Ionicons name="document-text-outline" size={22} color={Colors.text.textLight} />
                                        </View>
                                    )}
                                    <View style={styles.memoryBody}>
                                        <Text style={styles.memoryTitle}>
                                            {memory.yearsAgo === 1 ? 'A year ago today' : `${memory.yearsAgo} years ago today`}
                                        </Text>
                                        <Text style={styles.memoryMeta}>
                                            {parseDate(memory.date).getDate()}{' '}
                                            {MONTH_NAMES[parseDate(memory.date).getMonth()]}{' '}
                                            {parseDate(memory.date).getFullYear()} &middot;{' '}
                                            {memory.noteCount} {memory.noteCount === 1 ? 'note' : 'notes'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={Colors.text.textLight} />
                                </TouchableOpacity>
                            ))}

                            <View style={styles.filterRow}>
                                {FILTERS.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => setFilter(option)}
                                        style={[styles.filterChip, filter === option && styles.filterChipOn]}
                                    >
                                        <Text style={[styles.filterText, filter === option && styles.filterTextOn]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <EmptyState
                            icon="images-outline"
                            title="No photos yet"
                            hint="Attach a photo to a note and it will show up here."
                        />
                    }
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    )}
                    renderItem={({ item: row }) => (
                        <View style={styles.row}>
                            {row.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.cell}
                                    onPress={() => setViewerIndex(media.findIndex((m) => m.id === item.id))}
                                    accessibilityLabel={item.kind === 'video' ? 'Open video' : 'Open photo'}
                                >
                                    <Image
                                        source={{ uri: toAbsoluteUri(item.thumbPath ?? item.path) }}
                                        style={styles.cellImage}
                                        contentFit="cover"
                                        transition={120}
                                    />
                                    {item.kind === 'video' && (
                                        <View style={styles.playBadge}>
                                            <Ionicons name="play" size={11} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                            {/* Keeps the last row left-aligned instead of stretched. */}
                            {row.length < COLUMNS &&
                                Array.from({ length: COLUMNS - row.length }).map((_, i) => (
                                    <View key={`pad-${i}`} style={styles.cell} />
                                ))}
                        </View>
                    )}
                />
            )}

            {viewerIndex !== null && viewerIndex >= 0 && (
                <MediaViewer
                    media={media}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
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
            paddingBottom: 14,
        },
        headerTitle: { fontFamily: 'Pacifico', fontSize: 26, color: text },
        listContent: { flexGrow: 1, paddingHorizontal: 14, paddingBottom: 24 },
        memory: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: theme === 'light' ? Colors.light.secondary2 : Colors.dark.secondary2,
            borderRadius: 16,
            padding: 12,
            marginTop: 14,
        },
        memoryCover: { width: 58, height: 58, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
        memoryCoverEmpty: { alignItems: 'center', justifyContent: 'center' },
        memoryBody: { flex: 1 },
        memoryTitle: { fontFamily: 'Cagliostro', fontSize: 16, color: Colors.text.textLight },
        memoryMeta: { fontFamily: 'Kavivanar', fontSize: 12, color: Colors.text.textLight, opacity: 0.85, marginTop: 2 },
        filterRow: { flexDirection: 'row', gap: 7, paddingVertical: 14 },
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
        sectionTitle: { fontFamily: 'Kavivanar', fontSize: 12, color: text, opacity: 0.7, marginTop: 14, marginBottom: 7 },
        row: { flexDirection: 'row', gap: 5, marginBottom: 5 },
        cell: { flex: 1, aspectRatio: 1 },
        cellImage: { width: '100%', height: '100%', borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.08)' },
        playBadge: {
            position: 'absolute',
            left: 5,
            bottom: 5,
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
        },
    });
};

export default GalleryTab;
