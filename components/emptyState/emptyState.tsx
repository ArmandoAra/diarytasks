import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/context/ThemeProvider';

interface EmptyStateProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    title: string;
    /** Optional second line telling the user what to do next. */
    hint?: string;
}

/**
 * Shown instead of a blank screen when a list has nothing in it.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, hint }) => {
    const { theme } = useThemeContext();
    const color = theme === 'light' ? Colors.text.textDark : Colors.text.textLight;

    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={48} color={color} style={styles.icon} />
            <Text style={[styles.title, { color }]}>{title}</Text>
            {hint ? <Text style={[styles.hint, { color }]}>{hint}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    icon: {
        opacity: 0.35,
        marginBottom: 14,
    },
    title: {
        fontFamily: 'Kavivanar',
        fontSize: 18,
        textAlign: 'center',
        opacity: 0.8,
    },
    hint: {
        fontFamily: 'Kavivanar',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 6,
        opacity: 0.55,
    },
});

export default EmptyState;
