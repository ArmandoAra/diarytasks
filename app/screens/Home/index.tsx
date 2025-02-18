import { View, BackHandler, Alert, StatusBar, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';


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
import { useStatesContext } from '@/context/StatesProvider';
import { DeletingPopUp } from '@/components/delete/deletingPopUp';
import { useThemeContext } from '@/context/ThemeProvider';

const Home = () => {
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
    const [appLoading, setAppLoading] = useState(true); // Separate loading state for initial app load

    useEffect(() => {
        const loadAppData = async () => {
            try {
                const dbResult = await loadDatabase();
                if (!dbResult.success) {
                    throw new Error("Failed to load database"); // Handle DB error
                }

                const userResult = await getUser();
                const userData = JSON.parse(userResult);
                setUser({ name: userData.name, id: userData.id });
                setDbLoaded(true);
            } catch (error) {
                console.error("Error loading app data:", error);
                // Handle the error appropriately, e.g., show an error message to the user
            } finally {
                setAppLoading(false);
            }
        };
        loadAppData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading before fetching
            try {
                const tasks = await getTasksByDate(day);
                setTasks(Array.isArray(tasks.data) ? tasks.data : []);

                const notes = await getNotesByDate(day); // Fetch notes as well
                setDayNotes(Array.isArray(notes.data) ? notes.data : []);

            } catch (error) {
                console.error("Error retrieving data:", error);
                setTasks([]);
                setDayNotes([]);
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        if (dbLoaded) { // Only fetch data if the database is loaded
            fetchData();
        }

    }, [day, dbLoaded]); // Add dbLoaded as a dependency

    useEffect(() => {
        const backAction = () => {
            if (editNoteOpen.isOpen || editTaskOpen.isOpen || deletingOpen.isOpen) {
                setEditNoteOpen({ isOpen: false, id: "" });
                setEditTaskOpen({ isOpen: false, id: "" });
                setDeletingOpen({ isOpen: false, id: "", type: null });
                return true;
            }

            Alert.alert("Wait!!", "Are you sure you want to exit?", [
                { text: "Cancel", onPress: () => null, style: "cancel" },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
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
            {appLoading
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
// theme == "light" ? Colors.text.textDark : Colors.text.textLight
export default Home;