import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkTheme, DefaultTheme, NavigationContainer, useRoute } from '@react-navigation/native';
import { Text, View, Button, useColorScheme, StyleSheet } from 'react-native';
import navigation from '@react-navigation/native';
import { useNavigation, router, SplashScreen, useLocalSearchParams } from 'expo-router';

import { SQLiteProvider } from 'expo-sqlite';
import { GlobalProvider } from '@/context/GlobalProvider';
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
import EditNoteScreen from './screens/editNote/[id]';
import EditTaskScreen from './screens/editTask/[id]';
import SettingsScreen from './screens/settings/settings';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


// Configuración del Tab Navigator
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
    const colorScheme = useColorScheme();

    const themeStyle = colorScheme === 'light' ? styles.lightTheme : styles.darkTheme;
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    height: 60,
                    backgroundColor: themeStyle.backgroundColor,
                },
                tabBarItemStyle: {
                    paddingVertical: 10,
                    height: 60, // Evita que el espacio del label afecte el ícono
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={Home}
                options={{
                    tabBarLabel: () => null,
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
                    tabBarLabel: () => null,
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
                    tabBarLabel: () => null,
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
                    tabBarLabel: () => null,
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
                    tabBarLabel: () => null, // Ocultar el título
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
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

// Renderizar la navegación en la aplicación
export default function App() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        "space-mono": require('../assets/fonts/SpaceMono-Regular.ttf'),
        "Pacifico": require('../assets/fonts/Pacifico-Regular.ttf'), // Big titles
        "Kavivanar": require('../assets/fonts/Kavivanar-Regular.ttf'), // Normal Texts
        "Cagliostro": require('../assets/fonts/Cagliostro-Regular.ttf'), // Buttons and Mini titles
    });

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
                <ThemeProvider>
                    <AppNavigator />
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
