import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { SafeAreaView, StatusBar, Platform, SafeAreaViewComponent, Dimensions, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GlobalProvider } from '@/context/GlobalProvider';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack, Tabs } from 'expo-router';
import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "space-mono": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Pacifico": require('../assets/fonts/Pacifico-Regular.ttf'), // Big titles
    "Kavivanar": require('../assets/fonts/Kavivanar-Regular.ttf'), // Normal Texts
    "Cagliostro": require('../assets/fonts/Cagliostro-Regular.ttf'), // Buttons and Mini titles
  });

  const themeStyle = colorScheme === 'light' ? styles.lightTheme : styles.darkTheme;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName='diaryTasks.db'>
      <GlobalProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Tabs
            screenOptions={{
              tabBarStyle: {
                height: 60,
                backgroundColor: themeStyle.backgroundColor,
                elevation: 10,
                borderColor: "red",
                borderBottomWidth: 8,
                borderRightWidth: 4,
                borderLeftWidth: 4,
                borderRadius: 16,
                marginBottom: 3
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                tabBarActiveTintColor: Colors.light.secondary,
                tabBarInactiveTintColor: Colors.light.primary,
                headerShown: false,
              }}
            />
            <Tabs.Screen
              name="(createTask)"
              options={{
                title: 'Create Task',
                headerShown: false,
                tabBarIcon: ({ color }) => <MaterialIcons name="assignment-add" size={28} color={color} />,
                tabBarActiveTintColor: Colors.light.secondary,
                tabBarInactiveTintColor: Colors.light.primary,
              }}
            />
            <Tabs.Screen
              name="(createNote)"
              options={{
                title: 'Create Note',
                headerShown: false,
                tabBarIcon: ({ color }) => <MaterialIcons name="note-add" size={24} color={color} />,
                tabBarActiveTintColor: Colors.light.secondary,
                tabBarInactiveTintColor: Colors.light.primary,
              }}
            />
            <Tabs.Screen
              name="(map)"
              options={{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-month" size={24} color={color} />,
                tabBarActiveTintColor: Colors.light.secondary,
                tabBarInactiveTintColor: Colors.light.primary,
              }}
            />
            <Tabs.Screen
              name="(favorites)"
              options={{
                title: 'Favorites',
                headerShown: false,
                tabBarIcon: ({ color }) => <Fontisto name="star" size={24} color={color} />,
                tabBarActiveTintColor: Colors.light.secondary,
                tabBarInactiveTintColor: Colors.light.primary,
              }}
            />
          </Tabs>
        </ThemeProvider>
      </GlobalProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  lightTheme: {
    backgroundColor: Colors.dark.secondary,
  },
  darkTheme: {
    backgroundColor: Colors.dark.secondary,
  },
});
