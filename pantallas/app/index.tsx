import { StyleSheet, Text, Image, ActivityIndicator, Dimensions, ScrollView, View, TouchableOpacity, Pressable, BackHandler, Alert, StatusBar, Platform, DrawerLayoutAndroid } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import { useEffect, useRef, useState } from 'react';

import { Colors } from '@/constants/Colors';


// Icons
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';


//DB
import { createDatabaseStructure, loadDatabase } from '@/db/db';
import { createUser, getUser } from '@/db/userDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from '@/containers/homeContainer/home';
import { useNavigationState } from '@react-navigation/native';
import AppDrawer from '@/components/drawer/drawer';
import Loader from '@/components/loader/loader';

export default function App() {
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const { setUser } = useGlobalContext();

    useEffect(() => {
        loadDatabase()
            .then(() => {
                setDbLoaded(true);
                createDatabaseStructure();
            })
            .catch((error) => console.log(error));
        getUser(setUser)
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor={Colors.dark.primary} barStyle={'light-content'} />
            {!dbLoaded
                ? <Loader />
                : <Home />
            }
        </SafeAreaView>
    );
}
