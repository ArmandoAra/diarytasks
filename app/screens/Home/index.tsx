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
import { formatDate } from '@/Utils/helpFunctions';
import use from 'react';
import EditTaskScreen from '../editTask/[id]';
import EditNoteScreen from '../editNote/[id]';

interface HomeProps {
    navigation: any;
}

const today = formatDate(new Date());

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);

    const {
        user,
        day,
        editNoteOpen,
        editTaskOpen,
        setEditNoteOpen,
        setEditTaskOpen,
        setUser,
        setLoading,
        setDay,
        setTasks,
        loading,
        setDayNotes, } = useGlobalContext();

    useEffect(() => {
        loadDatabase()
            .then(() => {
                setDbLoaded(true);
                createDatabaseStructure();
            })
            .catch((error) => console.log(error));
        getUser(setUser, setLoading)
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await getTasksByDate(day);
            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching tasks.');
            }
        };

        fetchTasks();

    }, [day, loading]);

    useEffect(() => {
        const fetchNotesDay = async () => {
            const response = await getNotesByDate(day);
            if (response.success && response.data) {
                setDayNotes(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching notes.');
            }
        };
        fetchNotesDay();
        setLoading(false);
    }, [day, loading]);

    useEffect(() => {
        const backAction = () => {
            if (!editNoteOpen.isOpen && !editTaskOpen.isOpen) {
                Alert.alert("Hold on!", "Are you sure you want to exit?", [
                    { text: "Cancel", onPress: () => null, style: "cancel" },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true; // Bloquea el comportamiento por defecto
            } else {
                setEditNoteOpen({ isOpen: false, id: "" });
                setEditTaskOpen({ isOpen: false, id: "" });
                return true; // Bloquea el comportamiento por defecto
            }
        };

        // Agregar el evento al presionar el botón de retroceso
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        // Limpiar el evento al desmontar o cuando cambien las dependencias
        return () => backHandler.remove();
    }, [editNoteOpen, editTaskOpen]);

    return (
        <>
            <StatusBar translucent backgroundColor={Colors.light.primary} barStyle={'light-content'} />
            {editTaskOpen.isOpen && <EditTaskScreen />}
            {editNoteOpen.isOpen && <EditNoteScreen />}
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