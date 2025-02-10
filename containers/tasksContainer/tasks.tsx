import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Pressable, TextStyle } from 'react-native';
import Task from '../../components/task/task'; // Ajusta la ruta según tu proyecto

import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '../../constants/Colors';
import { CreateTaskProps, SortOption } from '@/interfaces/TasksInterfaces';

// Styles
import { formatDateToString } from '@/Utils/helpFunctions';

// Icons
import Entypo from '@expo/vector-icons/Entypo';
import { getTasksByDate } from '@/db/taskDb';


const TasksContainer = () => {
    const [sortOption, setSortOption] = React.useState<SortOption>("All");
    const { tasks, day, setTasks, loading } = useGlobalContext();


    const [sortedTasks, setSortedTasks] = useState<CreateTaskProps[]>(tasks);




    useEffect(() => {
        if (sortOption === 'All') {
            setSortedTasks(tasks);
        } else {
            setSortedTasks(tasks.filter(task => task.status === sortOption));
        }

    }, [sortOption, tasks]);


    return (
        <View
            style={{
                width: "96%",
                borderTopLeftRadius: 26,
                borderRadius: 16,
                overflow: "hidden",
                marginHorizontal: "auto",
                height: "54%",
                backgroundColor: Colors.light.secondary
            }}>
            <View style={{ width: "100%", margin: "auto", height: "10%", backgroundColor: Colors.light.secondary }}>
                <Text style={{ fontSize: 18, fontFamily: "Kavivanar", margin: "auto" }}>{formatDateToString(day)}</Text>
            </View >
            {/* Select para ordenar */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                height: "10%",
                width: "100%",
                borderBottomColor: "black",
                borderBottomWidth: 1,
                alignItems: "center"
            }}>
                <TouchableOpacity style={{ width: "33%", flexDirection: "row", gap: 4 }} onPress={() => setSortOption("All")} >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "All" && <Entypo name="bookmark" size={24} color={Colors.light.background2} />}
                    </View>
                    <Text style={[styles.textButton, { width: "85%" }, sortOption === "All" ? styles.textButtonActive : styles.textButtonInactive]}>
                        All Tasks
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "33%", flexDirection: "row", gap: 4 }} onPress={() => setSortOption("Completed")}  >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "Completed" && <Entypo name="bookmark" size={24} color={Colors.light.background2} />}
                    </View>
                    <Text style={[styles.textButton, { width: "85%" }, sortOption === "Completed" ? styles.textButtonActive : styles.textButtonInactive]} >Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "33%", flexDirection: "row", gap: 5 }} onPress={() => setSortOption("ToDo")}  >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "ToDo" && <Entypo name="bookmark" size={24} color={Colors.light.background2} />}
                    </View>
                    <Text style={[styles.textButton, { width: "65%" }, sortOption === "ToDo" ? styles.textButtonActive : styles.textButtonInactive]} >To Do</Text>
                </TouchableOpacity>
            </View>
            {/* <TornPaperButton /> */}

            {/* Lista de tareas */}
            <ScrollView style={{ paddingHorizontal: 5, backgroundColor: Colors.light.secondary2 }} >
                {sortedTasks.map(task => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        status={task.status}
                        date={task.date || ""}
                    />
                ))}

            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    textButton: {
        fontSize: 12,
        textAlignVertical: "center",
        fontFamily: "Cagliostro",
        textAlign: "center",
    }, textButtonActive: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 10
    }, textButtonInactive: {
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.dark.secondary,
        borderRadius: 10
    }
});

const stylesDrop = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default TasksContainer;
