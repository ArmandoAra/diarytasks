import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";


const TornPaperButton = () => {
    const router = useRouter();

    return (
        <Pressable style={styles.button} onPress={() => router.push("/createTask")}>
            <Image source={require('../../assets/icons/buttons/create.png')}
                style={styles.background}
                resizeMode='cover'
            ></Image>
            <Text style={styles.text}>+</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

    },
    background: {
        position: "absolute",
        width: 48,
        height: 48,

    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        position: "absolute",
    },
});

export default TornPaperButton;
