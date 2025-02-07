import { Link, Stack, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

//icons
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, StyleSheetProperties, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function CreateNoteLayout() {
    return (
        <React.Suspense fallback={<ActivityIndicator size='large' color='blue' />}>

            <Stack>
                <Stack.Screen name="createNote" options={{ headerShown: false }} />
                <Stack.Screen name="[id]" options={{ headerShown: false }} />
            </Stack>
        </React.Suspense >

    );
}


