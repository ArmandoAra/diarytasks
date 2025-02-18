import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Task from '../../components/task/task';

import { useGlobalContext } from '@/context/GlobalProvider';
import { Colors } from '../../constants/Colors';
import { CreateTaskProps, SortOption } from '@/interfaces/TasksInterfaces';
import { formatDateToString } from '@/Utils/helpFunctions';
import Entypo from '@expo/vector-icons/Entypo';
import { useThemeContext } from '@/context/ThemeProvider';
import { CreateNewTask } from '../createTask/createTask';

interface TasksContainerProps { } // Define props if needed

const TasksContainer: React.FC<TasksContainerProps> = () => {
    const [sortOption, setSortOption] = useState<SortOption>("All");
    const { tasks, day } = useGlobalContext();
    const { theme } = useThemeContext();
    const [sortedTasks, setSortedTasks] = useState<CreateTaskProps[]>(tasks);

    useEffect(() => {
        let filteredTasks = tasks;
        if (sortOption !== 'All') {
            filteredTasks = tasks.filter(task => task.status === sortOption);
        }
        setSortedTasks(filteredTasks);
    }, [sortOption, tasks]);


    const styles = createStyles(theme as "light" | "dark"); // Type the theme

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateText}>{formatDateToString(day)}</Text>
            </View>
            <View style={styles.filterContainer}>
                <FilterButton
                    label="All Tasks"
                    selected={sortOption === "All"}
                    onPress={() => setSortOption("All")}
                    theme={theme as "light" | "dark"} // Type the theme
                />
                <FilterButton
                    label="Completed"
                    selected={sortOption === "Completed"}
                    onPress={() => setSortOption("Completed")}
                    theme={theme as "light" | "dark"} // Type the theme
                />
                <FilterButton
                    label="To Do"
                    selected={sortOption === "ToDo"}
                    onPress={() => setSortOption("ToDo")}
                    theme={theme as "light" | "dark"} // Type the theme
                />
            </View>
            <ScrollView style={styles.scrollView}>
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
    );
};

interface FilterButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    theme: 'light' | 'dark'; // Add theme prop
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, selected, onPress, theme }) => {
    const styles = createStyles(theme);
    return (
        <TouchableOpacity style={styles.filterButton} onPress={onPress}>
            <View style={styles.filterIconContainer}>
                {selected && <Entypo name="bookmark" size={24} color={theme === "light" ? Colors.light.background2 : Colors.dark.background} />}
            </View>
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );
};


const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            width: "96%",
            flex: 1,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginTop: 5,
            overflow: "hidden",
            marginHorizontal: "auto",
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
        },
        header: {
            width: "100%",
            height: 50,
            backgroundColor: theme === "light" ? Colors.light.secondary : Colors.dark.secondary2,
            justifyContent: 'center', // Center text vertically
            alignItems: 'center',   // Center text horizontally
        },
        dateText: {
            fontSize: 18,
            fontFamily: "Kavivanar",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
        },
        filterContainer: {
            flexDirection: "row",
            height: 50,
            justifyContent: "space-around",
            borderBottomColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
            borderBottomWidth: 1,
            alignItems: "center",
        },
        filterButton: {
            width: 100,
            flexDirection: "row",
            gap: 4,
            alignItems: 'center', // Vertically center icon and text
            justifyContent: 'center', // Horizontally center icon and text
        },
        filterIconContainer: {
            width: "15%",
            height: "auto",
        },
        filterText: {
            fontSize: 12,
            textAlignVertical: "center",
            fontFamily: "Cagliostro",
            textAlign: "center",
            width: "85%",
            color: theme === "light" ? Colors.text.textDark : Colors.text.textLight,
            borderRadius: 10,
            padding: 5, // Add padding
        },
        filterTextSelected: {
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme === "light" ? Colors.dark.primary : Colors.light.primary,
        },
        scrollView: {
            paddingHorizontal: 5,
            paddingVertical: 10,
            backgroundColor: theme === "light" ? Colors.light.background2 : Colors.dark.background,
        },
    });

export default TasksContainer;