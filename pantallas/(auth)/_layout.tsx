import { Stack } from 'expo-router';
import React from 'react';

export default function IsertUserLayout() {

    return (
        <Stack>
            <Stack.Screen
                name="insertUser" //El nomber tiene que ser igual al que se pone en el archivo de rutas
                options={{
                    headerStyle: {
                        backgroundColor: '#003b35',
                    },
                    headerTitle: "Insert User",
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    // headerLeft va a contener el icono de usuario o el de invitado
                }}

            />
        </Stack>
    );
}
