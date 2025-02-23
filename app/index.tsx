import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Keyboard } from 'react-native';

import { SplashScreen } from 'expo-router';
import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SQLiteProvider } from 'expo-sqlite';

import { GlobalProvider } from '@/context/GlobalProvider';
import { ThemeProvider, useThemeContext } from '@/context/ThemeProvider';
import { Colors } from '@/constants/Colors';

import Home from './screens/Home/index';
import CreateNoteTab from './(tabs)/Notes/notes';
import FavoritesTab from './(tabs)/Favorites/favorites';
import MapTab from './(tabs)/Map/map';


import SettingsScreen from './screens/settings/settings';
import { StatesProvider } from '@/context/StatesProvider';

SplashScreen.preventAutoHideAsync();


const Tab = createBottomTabNavigator();
const HomeTabs = () => {
    const { theme } = useThemeContext();
    // Ocultar el tab bar cuando el teclado está visible
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: isKeyboardVisible ? { display: "none" } : { height: 60, backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.background2 },
                tabBarItemStyle: {
                    paddingVertical: 5,
                    height: 60,
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
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Notes"
                component={CreateNoteTab}
                options={{
                    tabBarLabel: "Day Notes",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="note-add" size={28} color={color} />,
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesTab}
                options={{
                    tabBarLabel: "Favorites",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Fontisto name="star" size={25} color={color} />,
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
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
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
                }}
            />

        </Tab.Navigator>

    );
}


const Stack = createStackNavigator();
const AppNavigator = () => (
    <Stack.Navigator>

        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />

        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

export default function App() {
    const [loaded] = useFonts({
        "Pacifico": require('../assets/fonts/Pacifico-Regular.ttf'),
        "Kavivanar": require('../assets/fonts/Kavivanar-Regular.ttf'),
        "Cagliostro": require('../assets/fonts/Cagliostro-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);


    return (
        <SQLiteProvider databaseName='diaryTasks.db'>
            <ThemeProvider>
                <GlobalProvider>
                    <StatesProvider>
                        <AppNavigator />
                    </StatesProvider>
                </GlobalProvider>
            </ThemeProvider>
        </SQLiteProvider>
    );
};

