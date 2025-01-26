import { StyleSheet, Text, Image, ActivityIndicator, Dimensions, ScrollView, View, TouchableOpacity } from 'react-native';
import { Redirect, router } from 'expo-router';

import { useEffect, useState } from 'react';


//DB
import React from 'react';
import { loadDatabase, getUser } from '@/db/db';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const { isLogged, setUser, setIsLogged, user } = useGlobalContext();


    useEffect(() => {
        loadDatabase()
            .then(() => setDbLoaded(true))
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
            {!isLogged ?
                <TouchableOpacity
                    style={{ height: 60, backgroundColor: '#0c4a6e', alignItems: 'center', justifyContent: 'center', width: '80%', borderRadius: 30, marginVertical: 30, marginHorizontal: '10%' }}
                    onPress={() => router.push("./insertUserScreen")}
                    accessibilityLabel="Navigate to insert user pages">
                    <Text style={{ color: 'white', fontSize: 24 }}  >New User</Text>
                </TouchableOpacity>
                : <TouchableOpacity
                    style={{ height: 60, backgroundColor: '#0c4a6e', alignItems: 'center', justifyContent: 'center', width: '80%', borderRadius: 30, marginVertical: 30, marginHorizontal: '10%' }}
                    onPress={() => router.push("./home")}
                    accessibilityLabel="Navigate to my notes">
                    <Text style={{ color: 'white', fontSize: 24 }}  >Go to Notes</Text>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
}

