import React from 'react'
import { StyleSheet, TouchableOpacity, useColorScheme, } from 'react-native';

import { Colors } from '@/constants/Colors';

interface ThemedProps {
    children: React.ReactNode;
    style?: any;
    action: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomButton = ({ children, style, }: ThemedProps) => {
    const colorScheme = useColorScheme();

    const themeStyle = colorScheme === 'light' ? styles.lightTheme : styles.darkTheme;



    return (
        <TouchableOpacity style={[themeStyle, style]} onPress={action()}>
            {children}
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    lightTheme: {
        backgroundColor: Colors.light.primary,
    },
    darkTheme: {
        backgroundColor: Colors.dark.secondary,
    },
});

export default CustomButton;
