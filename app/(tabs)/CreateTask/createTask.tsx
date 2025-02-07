import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, SplashScreen } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useGlobalContext } from '@/context/GlobalProvider';

//interfaces
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';

// Db
import { createTask, getTasksByDate } from '@/db/taskDb';
import { useRoute } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { TextStyle } from 'react-native';

// interface HomeScreenProps {
//     navigation: any;
// }

const CreateTaskTab = () => {
    const route = useRoute();
    const { day, setTasks } = useGlobalContext();

    const [data, setData] = useState<CreateTaskProps>(
        {
            id: "",
            title: '',
            description: '',
            status: 'ToDo',
            priority: 'Low',
            date: day,
        }
    );

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            date: day,
        }))
    }, [day])

    // useEffect(() => {
    //     const fetchTasks = async () => {
    //         const response = await getTasksByDate(day);
    //         if (response.success && response.data) {
    //             setTasks(response.data);
    //         } else {
    //             console.log(response.message || 'An error occurred while fetching tasks.');
    //         }
    //     };
    //     fetchTasks();
    // }, [day])

    const handleChanges = (key: keyof CreateTaskProps, value: string | Date) => {
        setData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const onSubmit = async () => {
        createTask(data)
        const fetchTasks = async () => {
            const response = await getTasksByDate(day);
            if (response.success && response.data) {
                setTasks(response.data);
            } else {
                console.log(response.message || 'An error occurred while fetching tasks.');
            }
        };
        fetchTasks();

        router.push("/")
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            <View style={styles.container} >
                <View style={{ backgroundColor: Colors.light.secondary2, width: "90%", margin: "auto" }}>
                    <Text style={styles.label}>Create Task </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
                        <TextInput
                            style={{ ...styles.input, fontFamily: "Kavivanar", textAlignVertical: "bottom", backgroundColor: Colors.light.secondary, width: "55%", padding: 15, borderRadius: 16 }}
                            value={data.title}
                            onChangeText={(value) => handleChanges("title", value)}
                            placeholder="Enter task title"

                        />
                        <View style={{ width: 120, height: 50, borderRadius: 16, borderWidth: 1, backgroundColor: '#a8232300' }}>
                            <Picker
                                selectedValue={data.priority}
                                onValueChange={(value) => handleChanges("priority", value)}
                            >
                                <Picker.Item label="High" value="High" style={{ fontSize: 11, height: "100%", fontFamily: "Kavivanar" }} />
                                <Picker.Item label="Medium" value="Medium" style={{ fontSize: 11, height: "100%", fontFamily: "Kavivanar" }} />
                                <Picker.Item label="Low" value="Low" style={{ fontSize: 11, height: "100%", fontFamily: "Kavivanar" }} />
                            </Picker>
                        </View>
                    </View>
                    <TextInput
                        style={[styles.input, {
                            height: 150,
                            marginHorizontal: 10,
                            padding: 15,
                            marginBottom: 10,
                            backgroundColor: Colors.light.secondary,
                            borderRadius: 16,
                            fontFamily: "Kavivanar",
                        }]}
                        value={data.description}
                        onChangeText={(value) => handleChanges("description", value)}
                        placeholder="Enter task description"
                        numberOfLines={5}
                        multiline
                        textAlignVertical='top'
                    />
                </View>
                <View style={{ width: "100%", flexDirection: "row", height: 50, justifyContent: "flex-end", paddingRight: 20 }}>
                    <TouchableOpacity onPress={onSubmit} style={{ right: 0, position: "relative" }} >
                        <MaterialIcons name="assignment-add" size={38} color={Colors.light.background2} />
                    </TouchableOpacity>
                </View >
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        height: 380,
        width: '90%',
        borderRadius: 19,
        marginTop: 40,
        marginHorizontal: 'auto',
        alignContent: "space-around",
        backgroundColor: Colors.light.secondary,
    },
    label: {
        height: 70,
        fontSize: 30,
        fontFamily: 'Pacifico',
        textAlign: 'center',
        textAlignVertical: 'center',

    },
    input: {
        alignContent: 'flex-start',
        fontSize: 16,

    },
});

export default CreateTaskTab;