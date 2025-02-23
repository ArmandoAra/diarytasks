import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";
import { createUser, updateUser } from "@/db/userDb";
import { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavProps } from "@/interfaces/types";
import { useThemeContext } from "@/context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SettingsScreen = () => {
    const { user, setUser } = useGlobalContext();
    const { theme, setTheme } = useThemeContext();
    const [newUser, setNewUser] = useState<string>(user.name);
    const [loading, setLoading] = useState<boolean>(false);

    const navigation = useNavigation<BottomTabNavProps>();

    const handleChanges = useCallback((value: string) => {
        setNewUser(value);
    }, []);

    const changeTheme = async (newTheme: string) => {
        try {
            await AsyncStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    };

    const onSave = useCallback(async () => {
        if (user.name !== newUser) {
            try {
                setLoading(true);
                await updateUser(user.id, newUser);
                setUser({ name: newUser, id: user.id });
            } catch (error) {
                console.error("Error updating user:", error);
                await createUser(newUser);
            } finally {
                setLoading(false);
            }
        }
        navigation.navigate("Home");
    }, [newUser, user, setUser]);

    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? Colors.light.background : Colors.dark.background }]}>
            <View style={[styles.card, { backgroundColor: theme === "light" ? Colors.light.primary : Colors.dark.background2 }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme === "light" ? Colors.text.textDark : Colors.text.textLight }]}>Settings</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Ionicons name="close" size={30} color={theme === "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    onChangeText={handleChanges}
                    value={newUser}
                    placeholder={user.name}
                    style={[styles.input, { color: theme === "light" ? Colors.text.textDark : Colors.text.textLight }]}
                    maxLength={14}
                    multiline={false}
                    accessibilityLabel="User Name"
                />
                <TouchableOpacity onPress={onSave} style={[styles.saveButton, {
                    backgroundColor: theme == "light" ? Colors
                        .light.secondary : Colors.dark.secondary2,
                }]} disabled={loading}>
                    <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
                <View style={styles.themeContainer}>
                    <TouchableOpacity onPress={() => changeTheme("light")} style={styles.themeButton}>
                        <Ionicons name="sunny" size={24} color={theme === "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeTheme("dark")} style={styles.themeButton}>
                        <Ionicons name="moon" size={24} color={theme === "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        position: "absolute",
        top: 40,
        width: "90%",
        height: 350,
        margin: 20,
        zIndex: 10,
        borderRadius: 16,
        elevation: 5,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 36,
        fontFamily: "Pacifico",
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        fontSize: 20,
        fontFamily: "Kavivanar",
        borderBottomWidth: 1,
        marginVertical: 20,
    },
    saveButton: {

        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    saveText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    themeContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    themeButton: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    }
});


export default SettingsScreen;
