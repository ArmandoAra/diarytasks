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
import { YearAndMonthProvider } from '@/context/YearAndMonthProvider';
import { getMonthByNumber } from '@/utils/getMonth';




export default function MapLayout() {



    return (
        <React.Suspense fallback={<ActivityIndicator size='large' color='blue' />}>
            <Stack>
                <Stack.Screen name="map" options={{ headerShown: false }}
                />
            </Stack>
        </React.Suspense>

    );
}


