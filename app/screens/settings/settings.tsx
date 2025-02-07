import { Colors } from "@/constants/Colors"
import { useGlobalContext } from "@/context/GlobalProvider"
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"

// Db
import { createUser, updateUser } from "@/db/userDb";
import { useState } from "react";

const SettingsScreen = () => {
    const { setSettingsOpen, user, setUser, setLoading } = useGlobalContext()
    const [newUser, setNewUser] = useState<string>(user.name);

    const handleChanges = (value: string) => {
        setNewUser(value)
    }

    const onClose = (newUser: string) => {
        if (user.name != newUser) {
            try {
                updateUser(user.id, newUser, setUser, setLoading)
            } catch (error) {
                if (error) {
                    createUser(newUser, setUser, setLoading)
                }
                console.log(error)
            }
        }
        setSettingsOpen(false)

    }

    return (
        <View style={{
            position: "absolute",
            top: 40,
            width: "90%",
            height: 350,
            backgroundColor: "white",
            margin: 20,
            zIndex: 10,
            borderRadius: 16
        }}>
            <TouchableOpacity
                onPress={() => onClose(newUser)}
                style={{ width: 40, left: "88%", top: 10 }}>
                <MaterialCommunityIcons name="close-thick" size={30} color="black" />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", fontSize: 34, }}>Settings</Text>


            <View style={{ flexDirection: "row", marginHorizontal: "auto", marginTop: 20, width: "80%" }}>
                <View style={{ flexDirection: "row", marginHorizontal: "auto" }}>
                    <Text style={{ fontSize: 20, textAlignVertical: "center" }}> Hi,</Text>
                    <TextInput
                        onChangeText={(value) => handleChanges(value)}
                        value={newUser}
                        placeholder={user.name}
                        style={{ fontSize: 20, }}
                        maxLength={14}
                        multiline={false}
                    />
                    <Text style={{ fontSize: 10, textAlignVertical: "center" }}> ✏️</Text>
                </View>
            </View>
            <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 34 }}>Change Theme</Text>
                <View style={{ flexDirection: "row", marginTop: 15, gap: 30 }}>

                    <TouchableOpacity style={styles.themeActive}><Octicons name="sun" size={36} color="black" /></TouchableOpacity>
                    <TouchableOpacity><Ionicons name="moon-sharp" size={36} color="black" /></TouchableOpacity>
                </View>
            </View>
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