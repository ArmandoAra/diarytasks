import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none"
        }
      }}
    >
    </Tabs>
  );
}
