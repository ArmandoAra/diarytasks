import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CreateTaskLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{

        headerShown: false,
        tabBarStyle: {
          display: "none"
        }
      }}>

    </Tabs>
  );
}
