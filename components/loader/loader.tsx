import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';
import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native';


const Loader = () => {
    const { theme } = useThemeContext();
    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.background
            }}>
            <ActivityIndicator size='large' color={theme == "light" ? Colors.light.ternary2 : Colors.dark.secondary2} />
            <Text style={{ color: theme == "light" ? Colors.text.textDark : Colors.text.textLight, fontFamily: "Pacifico", fontSize: 35 }} >Loading...</Text>
        </View >
    )
}

export default Loader;
