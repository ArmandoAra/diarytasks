import { StyleSheet, Text, Image, ActivityIndicator, Dimensions, ScrollView, View, TouchableOpacity, Pressable, BackHandler, Alert } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import { useEffect, useState } from 'react';


//DB
import { createDatabaseStructure, loadDatabase } from '@/db/db';
import { createUser, getUser } from '@/db/userDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from '@/containers/homeContainer/home';
import { useNavigationState } from '@react-navigation/native';

export default function App() {
    const currentRoute = useNavigationState(state => {
        // Obtén la última ruta del stack de navegación
        const route = state.routes[state.index];
        return route.name;
    });
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const { isLogged, setUser, setIsLogged, setLoading, user } = useGlobalContext();
    const [testUser, setTestUser] = useState<Promise<void>>()


    useEffect(() => {
        loadDatabase()
            .then(() => {
                setDbLoaded(true);
                createDatabaseStructure();
            })
            .catch((error) => console.log(error));
    }, []);


    useEffect(() => {
        getUser(setUser, setIsLogged)
    }, [])

    if (!dbLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='blue' />
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flexDirection: 'column', backgroundColor: 'black', flex: 1 }} >
            <Home />
        </SafeAreaView>
    );
}

