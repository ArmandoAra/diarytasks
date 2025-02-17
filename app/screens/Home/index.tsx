import { View, BackHandler, Alert, StatusBar, SafeAreaView } from 'react-native';
import { useEffect } from 'react';


import { Colors } from '@/constants/Colors';

// Icons

//DB
import { loadDatabase } from '@/db/db';
import { getUser } from '@/db/userDb';
import { useGlobalContext } from '@/context/GlobalProvider';
import Loader from '@/components/loader/loader';
import { getNotesByDate } from '@/db/noteDb';
import { getTasksByDate } from '@/db/taskDb';
import TasksContainer from '@/containers/tasksContainer/tasks';
import Header from '@/components/header/header';
import EditTaskScreen from '@/containers/editTask/editTask';
import EditNoteScreen from '@/containers/editNote/editNote';
import { useStatesContext } from '@/context/StatesProvider';
import { DeletingPopUp } from '@/components/delete/deletingPopUp';
import use from 'react';
import { de } from 'react-native-paper-dates';
import { useThemeContext } from '@/context/ThemeProvider';

interface HomeProps {
    navigation: any;
}

const Home: React.FC<HomeProps> = () => {
    const { theme } = useThemeContext();
    const { day, user, setUser, setTasks, setDayNotes, } = useGlobalContext();
    const { dbLoaded,
        editNoteOpen,
        editTaskOpen,
        setDbLoaded,
        setEditNoteOpen,
        setEditTaskOpen,
        deletingOpen,
        setLoading,
        loading,
        setDeletingOpen } = useStatesContext();

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
                setTasks(Array.isArray(tasks.data) ? tasks.data : []);
            })
            .catch((error) => {
                console.error("Error retrieving tasks:", error);
                setTasks([]);
            });

        setLoading(false);

    }, [day]);

    useEffect(() => {
        const backAction = () => {
            if (!editNoteOpen.isOpen && !editTaskOpen.isOpen) {
                Alert.alert("Wait!!", "Are you sure you want to exit?", [
                    { text: "Cancel", onPress: () => null, style: "cancel" },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true; // Bloquea el comportamiento por defecto
            }
            setEditNoteOpen({ isOpen: false, id: "" });
            setEditTaskOpen({ isOpen: false, id: "" });
            setDeletingOpen({ isOpen: false, id: "", type: null });
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, [editNoteOpen, editTaskOpen, deletingOpen]);

    return (
        <>
            <StatusBar translucent backgroundColor={Colors.light.primary} barStyle={'light-content'} />
            {editTaskOpen.isOpen && <EditTaskScreen />}
            {(deletingOpen.isOpen && deletingOpen.type == "Task") && <DeletingPopUp />}
            {!dbLoaded
                ? <Loader />
                :
                <View style={{ flex: 1, backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.background }}>
                    <Header />
                    <TasksContainer />
                </View>
            }
        </>
    );
}

export default Home;