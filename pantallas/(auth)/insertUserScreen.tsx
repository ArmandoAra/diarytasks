
import React, { useEffect, useState } from 'react'
import { StyleSheet, Alert, Image, View, Pressable, TouchableOpacity, Button, Text } from 'react-native';

//Components
import FormField from '@/components/auth/FormField';
import { router } from 'expo-router';

import { useGlobalContext } from '@/context/GlobalProvider';
import { createDatabaseStructure, inserUserByName } from '@/db/db';
// import { createDatabaseStructure, inserUserByName } from '@/db/dbTools';

const SignUp = () => {
    const { setUser, setIsLogged, setLoading } = useGlobalContext();
    const [form, setForm] = useState({
        userName: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funcion para crear la estructura de la base de datos
    useEffect(() => {
        createDatabaseStructure();
    }, [])



    //Funcion para enviar los datos del formulario
    const submit = async () => {

        if (!form.userName || form.userName === "") {
            Alert.alert("All fields are required");
            return;
        }
        setIsSubmitting(true);
        try {
            await inserUserByName(form.userName, setUser, setIsLogged, setLoading);
            router.push("/home");
        } catch (error) {
            Alert.alert("Error creating user");
        } finally {
            setIsSubmitting(false);
        }

    }

    return (

        <View style={{ flex: 1 }}>

            <View style={styles.container}>
                <Text >Welcome</Text>
                <Text  >Write your name:</Text>
                <View style={{ marginTop: 20, gap: 10 }}>
                    <FormField
                        title="Name"
                        value={form.userName}
                        handleChangeText={(text: string) => setForm({ ...form, userName: text })}
                    />
                    <Button
                        title='Sign Up'
                        onPress={submit}
                    />
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        gap: 8,
        paddingTop: 20,
        height: '100%',
    },
    buttonUp: {
        fontSize: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    headerImage: {
        width: '100%',
        height: 250,
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
})

export default SignUp;
