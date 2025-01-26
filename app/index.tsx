import { StyleSheet, Text, Image, ActivityIndicator, Dimensions, ScrollView, View, TouchableOpacity, Pressable } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import { useEffect, useState } from 'react';


//DB
import { createDatabaseStructure, loadDatabase } from '@/db/db';
import { createUser, getUser } from '@/db/userDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const { isLogged, setUser, setIsLogged, setLoading, user } = useGlobalContext();
    const [testUser, setTestUser] = useState<Promise<void>>()


    useEffect(() => {
        loadDatabase()
            .then(() => {
                setDbLoaded(true);
                // createDatabaseStructure();
            })
            .catch((error) => console.log(error));
    }, []);


    // useEffect(() => {
    //     createUser("Luis", setUser, setIsLogged, setLoading)
    //     console.log(testUser + "line 28 index")
    // }, [])

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
        <SafeAreaView style={{ flexDirection: 'column', backgroundColor: 'black', marginTop: 60 }} >
            <View>
                <View>
                    <View style={{ flexDirection: 'column', }} >
                        <Text style={{ fontSize: 100, color: "white", paddingHorizontal: 20, marginTop: 60 }}>Diary</Text>
                        <Text style={{ fontSize: 100, color: "white", paddingHorizontal: 20, marginTop: -30 }}>Tasks</Text>
                    </View>
                    <Text style={{ fontSize: 50, color: 'black', padding: 20, backgroundColor: '#fff' }}>Hi, {user || "New User"}.</Text>
                    <Text style={{ fontSize: 23, color: 'white', padding: 20 }}>Keep safe all your tasks and daily notes.</Text>
                </View>

            </View>
            <View>
                <Link
                    style={{ height: 60, backgroundColor: '#0c4a6e', alignItems: 'center', justifyContent: 'center', width: '80%', borderRadius: 30, marginVertical: 30, marginHorizontal: '10%' }}
                    href="/home" asChild
                >
                    <Pressable>
                        <Text style={{ color: 'white', fontSize: 24 }}>Tasks</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}

