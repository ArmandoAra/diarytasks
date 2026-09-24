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

import TimelineTab from './(tabs)/Timeline/timeline';
import GalleryTab from './(tabs)/Gallery/gallery';
import FavoritesTab from './(tabs)/Favorites/favorites';
import MapTab from './(tabs)/Map/map';


import SettingsScreen from './screens/settings/settings';
import { StatesProvider } from '@/context/StatesProvider';
import { AppBootstrap } from '@/context/AppBootstrap';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
                name="Timeline"
                component={TimelineTab}
                options={{
                    tabBarLabel: "Today",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapTab}
                options={{
                    tabBarLabel: "Calendar",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="calendar-month" size={30} color={color} />
                    ),
                    tabBarActiveTintColor: theme == 'light' ? Colors.light.background : Colors.text.textLight,
                    tabBarInactiveTintColor: theme == "light" ? Colors.text.textDark : Colors.dark.secondary2,
                }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryTab}
                options={{
                    tabBarLabel: "Gallery",
                    tabBarLabelStyle: { fontFamily: "Kavivanar" },
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="photo-library" size={27} color={color} />,
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
                    tabBarIcon: ({ color }) => <Fontisto name="star" size={24} color={color} />,
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
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
            <SQLiteProvider databaseName='diaryTasks.db'>
                <ThemeProvider>
                    <GlobalProvider>
                        <StatesProvider>
                            <AppBootstrap>
                                <AppNavigator />
                            </AppBootstrap>
                        </StatesProvider>
                    </GlobalProvider>
                </ThemeProvider>
            </SQLiteProvider>
        </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

