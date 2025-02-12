import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme, StyleSheet } from 'react-native';
import { SplashScreen } from 'expo-router';

import { SQLiteProvider } from 'expo-sqlite';
import { GlobalProvider, useGlobalContext } from '@/context/GlobalProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { useFonts } from 'expo-font';
import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// TABS
import Home from './screens/Home/index';
import CreateTaskTab from './(tabs)/CreateTask/createTask'
import CreateNoteTab from './(tabs)/CreateNote/createNote';
import FavoritesTab from './(tabs)/Favorites/favorites';
import MapTab from './(tabs)/Map/map';

//Screens
import SettingsScreen from './screens/settings/settings';
import { createDatabaseStructure, loadDatabase } from '@/db/db';
import { createUser, getUser } from '@/db/userDb';
import { set } from 'astro:schema';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


// Configuración del Tab Navigator
const Tab = createBottomTabNavigator();
const HomeTabs = () => {


    return (

        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    height: 60,
                    backgroundColor: Colors.light.background2,
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                    height: 60, // Evita que el espacio del label afecte el ícono
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={Home}
                options={{
                    tabBarLabel: "Home",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color} />,
                    tabBarActiveTintColor: Colors.light.primary,
                    tabBarInactiveTintColor: Colors.light.background,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="CreateTask"
                component={CreateTaskTab}
                options={{
                    tabBarLabel: "New Task",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="assignment-add" size={28} color={color} />,
                    tabBarActiveTintColor: Colors.light.primary,
                    tabBarInactiveTintColor: Colors.light.secondary,
                }}
            />
            <Tab.Screen
                name="Create Note"
                component={CreateNoteTab}
                options={{
                    tabBarLabel: "New Note",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="note-add" size={28} color={color} />,
                    tabBarActiveTintColor: Colors.light.primary,
                    tabBarInactiveTintColor: Colors.light.background,
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesTab}
                options={{
                    tabBarLabel: "Favorites",
                    // estilo de fuente del label
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Fontisto name="star" size={25} color={color} />,
                    tabBarActiveTintColor: Colors.light.primary,
                    tabBarInactiveTintColor: Colors.light.background,
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapTab}
                options={{
                    tabBarLabel: "Map",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="calendar-month" size={30} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.light.primary,
                    tabBarInactiveTintColor: Colors.light.background,
                }}
            />

        </Tab.Navigator>

    );
}

// Configuración del Stack Navigator
const Stack = createStackNavigator();
const AppNavigator = () => (

    <Stack.Navigator>
        {/* Tabs principales */}
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        {/* Pantallas fuera del TabNavigator */}
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

// Renderizar la navegación en la aplicación
export default function App() {
    const [loaded] = useFonts({
        "Pacifico": require('../assets/fonts/Pacifico-Regular.ttf'), // Big titles
        "Kavivanar": require('../assets/fonts/Kavivanar-Regular.ttf'), // Normal Texts
        "Cagliostro": require('../assets/fonts/Cagliostro-Regular.ttf'), // Buttons and Mini titles
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);


    return (
        <SQLiteProvider databaseName='diaryTasks.db'>
            <GlobalProvider>
                <ThemeProvider>
                    <AppNavigator />
                </ThemeProvider>
            </GlobalProvider>
        </SQLiteProvider>
    );
}

