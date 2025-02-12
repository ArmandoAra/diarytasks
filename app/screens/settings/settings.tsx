import { Colors } from "@/constants/Colors"
import { useGlobalContext } from "@/context/GlobalProvider"
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"

// Db
import { createUser, updateUser } from "@/db/userDb";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavProps } from "@/interfaces/types";

const SettingsScreen = () => {
    const { user, setUser, setLoading } = useGlobalContext()
    const [newUser, setNewUser] = useState<string>(user.name);
    const navigation = useNavigation<BottomTabNavProps>();

    const handleChanges = (value: string) => {
        setNewUser(value)
    }

    const onSave = (newUser: string) => {
        if (user.name != newUser) {
            try {
                updateUser(user.id, newUser, setUser, setLoading)
            } catch (error) {
                if (error) {
                    createUser(newUser)
                }
                console.log(error)
            }
        }
        navigation.navigate("Home")
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            <View style={{
                position: "absolute",
                top: 40,
                width: "90%",
                height: 350,
                backgroundColor: Colors.light.secondary,
                margin: 20,
                zIndex: 10,
                borderRadius: 16
            }}>
                <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 20 }}>
                    <Text style={{ textAlign: "center", fontSize: 36, fontFamily: "Pacifico", width: "90%" }}>Settings</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Home")}
                    >
                        <FontAwesome name="close" size={34} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>


                <View style={{ flexDirection: "row", marginHorizontal: "auto", marginTop: 30, width: "80%" }}>
                    <View style={{
                        flexDirection: "row", marginHorizontal: "auto"

                    }}>
                        <Text style={{ fontSize: 20, textAlignVertical: "center", fontFamily: "Kavivanar" }}> Hi,</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                onChangeText={(value) => handleChanges(value)}
                                value={newUser}
                                placeholder={user.name}
                                style={{
                                    fontSize: 20, fontFamily: "Kavivanar"
                                }}
                                maxLength={14}
                                multiline={false}
                            />
                            <View style={{ height: 35, justifyContent: "flex-end" }}>
                                <FontAwesome name="pencil" size={24} color="black" />
                            </View></View>
                        <TouchableOpacity
                            onPress={() => onSave(newUser)}
                            style={{ height: 40, backgroundColor: Colors.dark.primary, width: 60, borderRadius: 10, marginLeft: 12 }}>
                            <Text style={{ margin: "auto", fontSize: 14, textAlignVertical: "center", fontFamily: "Kavivanar" }}>Save</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
                    <Text style={{ fontSize: 34, fontFamily: "Pacifico" }}>Change Theme</Text>
                    <View style={{ flexDirection: "row", marginTop: 15, gap: 30 }}>

                        <TouchableOpacity style={styles.themeActive}><Octicons name="sun" size={36} color="black" /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="moon-sharp" size={36} color="black" /></TouchableOpacity>
                    </View>
                </View>
            </View >
        </View>
    )
};

const styles = StyleSheet.create({
    themeActive: {
        padding: 10,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 10
    }
})

export default SettingsScreen;