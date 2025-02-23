import { useGlobalContext } from '@/context/GlobalProvider';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { en, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en', en);

import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/interfaces/types';
import DayChangerContainer from '@/containers/dayChanger/dayChangerContainer';
import { useThemeContext } from '@/context/ThemeProvider';

interface HeaderProps { } // Define las props si las hay

const Header: React.FC<HeaderProps> = () => {
    const { user } = useGlobalContext();
    const { theme } = useThemeContext();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const styles = createStyles(theme as "light" | "dark");

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Diary Tasks</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={styles.settingsButton}
                    >
                        <Ionicons name="settings-outline" size={34} color={theme == "light" ? Colors.text.textDark : Colors.text.textLight} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.greetingText}>{`Hi, ${user?.name || 'User'}`}</Text>
            </View>
            <DayChangerContainer />
        </View>
    );
};

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    headerContainer: {
        height: 150,
    },
    headerContent: {
        height: '70%',
        paddingLeft: 30,
        backgroundColor: theme === 'light' ? Colors.light.primary : Colors.dark.background2,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 32,
        fontFamily: 'Pacifico',
        color: theme === 'light' ? Colors.text.textDark : Colors.text.textLight,
        marginBottom: 10,
    },
    settingsButton: {
        marginRight: 20,
    },
    iconColor: {
        color: theme === 'light' ? Colors.text.textDark : Colors.text.textLight,
    },
    greetingText: {
        fontSize: 20,
        fontFamily: 'Kavivanar',
        color: theme === 'light' ? Colors.text.textDark : Colors.text.textLight,
    },
});

export default Header;