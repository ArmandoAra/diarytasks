import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useStatesContext } from "@/context/StatesProvider";
import { useThemeContext } from "@/context/ThemeProvider";
import { createTask, getTasksByDate } from "@/db/taskDb";
import { CreateTaskProps } from "@/interfaces/TasksInterfaces";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState, useRef, useEffect, } from "react";
import { TextInput, Alert, View, Pressable, StyleSheet } from "react-native";


const initialData = (day: string): CreateTaskProps => {
    return {
        id: "",
        title: '',
        description: '',
        status: 'ToDo',
        priority: 'Low',
        date: day,
    }
}

export const CreateNewTask = () => {
    const { day, setTasks } = useGlobalContext();
    const { createTaskOpen, setCreateTaskOpen } = useStatesContext();
    const [data, setData] = useState<CreateTaskProps>(initialData(day));
    const descriptionInputRef = useRef<TextInput>(null);

    const { theme } = useThemeContext();

    const handleTask = () => {
        if (data.description == "" && createTaskOpen) return setCreateTaskOpen(false);
        if (!createTaskOpen) {
            setCreateTaskOpen(true);
            setTimeout(() => {
                descriptionInputRef.current?.focus(); // Asegurar que el input se enfoca después de renderizarse
            }, 100);
        } else {
            onSubmit();
            setCreateTaskOpen(false)
        }
    }

    const CloseTask = () => {
        if (createTaskOpen) {
            setData(initialData(day))
            setCreateTaskOpen(false)
        }
    }

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            date: day,
        }))
    }, [day])

    const handleChanges = (key: keyof CreateTaskProps, value: string | Date) => {
        setData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const onSubmit = async () => {
        if (!data.description) return Alert.alert("Please enter a description", "Description is required");
        createTask(data).then(() => {
            getTasksByDate(day).then((tasks) => setTasks(tasks.data as CreateTaskProps[]))
            setData(initialData(day))
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <View style={{ width: "100%" }}>
            <View
                style={{
                    flexDirection: createTaskOpen ? "column" : "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: createTaskOpen ? "absolute" : "relative",
                    right: 0,
                    marginBottom: createTaskOpen ? -20 : 40,
                    zIndex: 10,
                }}>
                <Pressable
                    onPress={() => handleTask()}
                    style={{ margin: 10 }}
                >
                    {/* Icono de plus */}
                    <AntDesign name="pluscircle" size={50} color={theme == "light" ? Colors.light.secondary : Colors.dark.background
                    } />
                </Pressable>
                {createTaskOpen && <Pressable
                    onPress={() => CloseTask()}
                    style={{ margin: 10, }}
                >
                    <AntDesign name="minuscircle" size={50} color={theme == "light" ? Colors.light.primary : Colors.dark.background} />
                </Pressable>}
            </View>
            {createTaskOpen && <View style={{
                padding: 5,
                borderRadius: 16,
                backgroundColor: theme == "light" ? Colors.light.background : Colors.dark.primary,
                elevation: 5,
                marginBottom: 40,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 10, marginBottom: 3 }}>
                    <TextInput
                        style={{ ...styles.input, fontFamily: "Kavivanar", textAlignVertical: "bottom", width: "40%", borderRadius: 16, height: 60 }}
                        value={data.title}
                        onChangeText={(value) => handleChanges("title", value)}
                        placeholder="Enter task title"

                    />
                    <View style={{ width: 120, height: 50, borderRadius: 16, borderWidth: 1, backgroundColor: '#a8232300' }}>
                        <Picker
                            selectedValue={data.priority}
                            onValueChange={(value) => handleChanges("priority", value)}
                        >
                            <Picker.Item label="High" value="High"
                                style={{ fontSize: 12, height: 5, fontFamily: "Kavivanar" }} />
                            <Picker.Item label="Medium" value="Medium" style={{ fontSize: 12, height: "60%", fontFamily: "Kavivanar" }} />
                            <Picker.Item label="Low" value="Low" style={{ fontSize: 12, height: "60%", fontFamily: "Kavivanar" }} />
                        </Picker>
                    </View>

                </View>
                <TextInput
                    style={[styles.input, {
                        height: 100,
                        padding: 15,
                        width: "80%",
                        borderRadius: 16,
                        fontFamily: "Kavivanar",
                    }]}
                    ref={descriptionInputRef}
                    value={data.description}
                    onChangeText={(value) => handleChanges("description", value)}
                    placeholder="Enter task description"
                    numberOfLines={5}
                    multiline
                    textAlignVertical='top'
                />
            </View>}
        </View>
    )
};



const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderRadius: 19,
        marginHorizontal: 'auto',
        alignContent: "space-around",
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
