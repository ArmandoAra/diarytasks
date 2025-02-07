import { StyleSheet, Text, Image, ActivityIndicator, Dimensions, ScrollView, View, TouchableOpacity, Pressable, BackHandler, Alert, StatusBar, Platform, DrawerLayoutAndroid, Button } from 'react-native';
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
import AppDrawer from '@/components/drawer/drawer';
import Loader from '@/components/loader/loader';
import { getNotesByDate } from '@/db/noteDb';
import { getTasksByDate } from '@/db/taskDb';
import NotesContainer from '@/containers/notesContainer/notesContainer';
import TasksContainer from '@/containers/tasksContainer/tasks';
import Header from '@/components/header/header';
import navigation from '@react-navigation/native';

interface HomeProps {
    navigation: any;
}


const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const { user, setUser, setLoading } = useGlobalContext();

    useEffect(() => {
        loadDatabase()
            .then(() => {
                setDbLoaded(true);
                createDatabaseStructure();
            })
            .catch((error) => console.log(error));
        getUser(setUser, setLoading)
    }, []);

    const {
        day,
        setTasks,
        loading,
        setDayNotes,
    } = useGlobalContext();

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await getTasksByDate(day);
            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching tasks.');
            }
        };

        const fetchNotesDay = async () => {
            const response = await getNotesByDate(day);
            if (response.success && response.data) {
                setDayNotes(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching notes.');
            }
        };

        fetchNotesDay();
        fetchTasks();
    }, [day, loading])

    return (
        <>
            <StatusBar translucent backgroundColor={Colors.light.primary} barStyle={'light-content'} />
            {!dbLoaded
                ? <Loader />
                :
                <View style={{ backgroundColor: Colors.light.background }}>
                    <Header />
                    <TasksContainer />
                    <NotesContainer />
                </View>
            }
        </>
    );
}

export default Home;