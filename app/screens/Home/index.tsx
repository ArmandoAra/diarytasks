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
import EditTaskScreen from '@/containers/editTask/editTask';
import EditNoteScreen from '@/containers/editNote/editNote';
import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';

interface HomeProps {
    navigation: any;
}

const today = formatDate(new Date());

const Home: React.FC<HomeProps> = ({ navigation }) => {

    const {
        dbLoaded,
        user,
        day,
        editNoteOpen,
        editTaskOpen,
        setDbLoaded,
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
            .then((res) => {
                if (res.success) {
                    getUser().then((us) => {
                        const userData = JSON.parse(us);
                        setUser({ name: userData.name, id: userData.id });
                    });
                    setDbLoaded(true);
                }
            })
    }, []);


    useEffect(() => {
        getTasksByDate(day)
            .then((tasks) => {
                setTasks(Array.isArray(tasks.data) ? tasks.data : []); // Asegurar que es un array
            })
            .catch((error) => {
                console.error("Error retrieving tasks:", error);
                setTasks([]); // Evita el error en el map()
            });

        getNotesByDate(day)
            .then((notes) => {
                setDayNotes(Array.isArray(notes.data) ? notes.data : []); // Asegurar que es un array
            })
            .catch((error) => {
                console.error("Error retrieving Notes:", error);
                setDayNotes([]); // Evita el error en el map()
            });

    }, [day]);




    useEffect(() => {
        const backAction = () => {
            if (!editNoteOpen.isOpen && !editTaskOpen.isOpen) {
                Alert.alert("Hold on!", "Are you sure you want to exit?", [
                    { text: "Cancel", onPress: () => null, style: "cancel" },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true; // Bloquea el comportamiento por defecto
            }
            setEditNoteOpen({ isOpen: false, id: "" });
            setEditTaskOpen({ isOpen: false, id: "" });
            return true; // Bloquea el comportamiento por defecto
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