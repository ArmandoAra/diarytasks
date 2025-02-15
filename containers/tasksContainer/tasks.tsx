import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Pressable, TextStyle, TextInput, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import Task from '../../components/task/task'; // Ajusta la ruta según tu proyecto

import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '../../constants/Colors';
import { CreateTaskProps, SortOption } from '@/interfaces/TasksInterfaces';

// Styles
import { formatDateToString } from '@/Utils/helpFunctions';

// Icons
import Entypo from '@expo/vector-icons/Entypo';
import { useThemeContext } from '@/context/ThemeProvider';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createTask, getTasksByDate } from '@/db/taskDb';
import { CreateNewTask } from '../createTask/createTask';



const TasksContainer = () => {
    const [sortOption, setSortOption] = React.useState<SortOption>("All");
    const { tasks, day } = useGlobalContext();
    const { theme } = useThemeContext();



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
                flex: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                marginTop: 2,

                overflow: "hidden",
                marginHorizontal: "auto",
                backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary,
            }}>
            <View
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: theme == "light" ? Colors.light.secondary : Colors.dark.secondary,
                }}>
                <Text style={{
                    fontSize: 18,
                    fontFamily: "Kavivanar",
                    margin: "auto",
                    color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                }}>{formatDateToString(day)}</Text>
            </View >
            {/* Select para ordenar */}
            <View style={{
                flexDirection: "row",
                height: 50,
                justifyContent: "space-around",
                borderBottomColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
                borderBottomWidth: 1,
                alignItems: "center",
            }}>
                <TouchableOpacity style={{ width: 100, flexDirection: "row", gap: 4 }} onPress={() => setSortOption("All")} >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "All" && <Entypo name="bookmark" size={24} color={theme == "light" ? Colors.light.background2 :
                            Colors.dark.background
                        } />}
                    </View>
                    <Text
                        style={[
                            {
                                fontSize: 12,
                                textAlignVertical: "center",
                                fontFamily: "Cagliostro",
                                textAlign: "center",
                                width: "85%",
                                color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
                            },
                            sortOption === "All" ? {
                                borderBottomWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
                                borderRadius: 10
                            } : {
                                borderBottomWidth: 2,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.secondary : Colors.light.secondary,
                                borderRadius: 10
                            }
                        ]}
                    >
                        All Tasks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: 100, flexDirection: "row", gap: 4 }} onPress={() => setSortOption("Completed")}  >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "Completed" && <Entypo name="bookmark" size={24} color={theme == "light" ? Colors.light.background2 :
                            Colors.dark.background
                        } />}
                    </View>
                    <Text
                        style={[
                            {
                                fontSize: 12,
                                textAlignVertical: "center",
                                fontFamily: "Cagliostro",
                                textAlign: "center",
                                width: "85%",
                                color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
                            },
                            sortOption === "Completed" ? {
                                borderBottomWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
                                borderRadius: 10
                            } : {
                                borderBottomWidth: 2,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.secondary : Colors.light.secondary,
                                borderRadius: 10
                            }
                        ]} >
                        Completed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: 100, flexDirection: "row", gap: 5 }} onPress={() => setSortOption("ToDo")}  >
                    <View style={{ width: "15%", height: "auto" }}>
                        {sortOption == "ToDo" && <Entypo name="bookmark" size={24} color={theme == "light" ? Colors.light.background2 :
                            Colors.dark.primaryLight
                        } light />}
                    </View>
                    <Text
                        style={[
                            {
                                fontSize: 12,
                                textAlignVertical: "center",
                                fontFamily: "Cagliostro",
                                textAlign: "center",
                                width: "85%",
                                color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
                            },
                            sortOption === "ToDo" ? {
                                borderBottomWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
                                borderRadius: 10
                            } : {
                                borderBottomWidth: 2,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: theme === "light" ? Colors.dark.secondary : Colors.light.secondary,
                                borderRadius: 10
                            }
                        ]} >To Do</Text>
                </TouchableOpacity>

            </View>
            {/* <TornPaperButton /> */}

            {/* Lista de tareas */}

            <ScrollView
                style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    backgroundColor: theme == "light" ? Colors.light.secondary2 : Colors.dark.background,
                }} >
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
                <CreateNewTask />

            </ScrollView>
        </View>
    )
};

export default TasksContainer;




