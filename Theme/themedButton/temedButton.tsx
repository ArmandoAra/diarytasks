import { Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ReactNode } from 'react';

interface ThemedButtonProps {
    children?: string | ReactNode;
    style?: any;
}

export default function ThemedButton({ children, style }: ThemedButtonProps) {
    const colorScheme = useColorScheme();

    const themeButtonStyle = colorScheme === 'light' ? styles.lightThemeButton : styles.darkThemeText;

    return (
        <TouchableOpacity style={[themeButtonStyle, style]}><Text style={{ textAlign: "center", fontFamily: "Cagliostro" }}>{children}</Text></TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    lightThemeButton: {
        color: Colors.text.textDark,
    },
    darkThemeText: {
        color: Colors.text.textLight,
    },
});
