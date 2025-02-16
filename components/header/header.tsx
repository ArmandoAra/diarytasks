import { useGlobalContext } from '@/context/GlobalProvider';
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';

import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

// utils
import { Colors } from '@/constants/Colors';

// Icons
import Ionicons from '@expo/vector-icons/Ionicons';

//Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/interfaces/types'; // Importa el tipo de rutas
import DayChangerContainer from '@/containers/dayChanger/dayChangerContainer';
import { useThemeContext } from '@/context/ThemeProvider';

const Header = () => {
    const { user } = useGlobalContext();
    const { theme } = useThemeContext();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <View
            style={{
                height: 150,
            }} >
            <View
                style={{
                    height: "70%",
                    paddingLeft: 30,
                    backgroundColor: theme == "light" ? Colors.light.primary : Colors.dark.background2
                }} >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                    <Text
                        style={{
                            textAlignVertical: "bottom",
                            fontSize: 32,
                            fontFamily: "Pacifico",
                            color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                        }} >
                        Diary Tasks
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        style={{
                            right: 40,
                            top: 30
                        }}>
                        <Text
                            style={{
                                color: theme == "light" ? Colors.text.textDark : Colors.text.textLight
                            }}>
                            <Ionicons name="settings-outline" size={34} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        textAlignVertical: "bottom",
                        fontSize: 20,
                        fontFamily: "Kavivanar",
                        color: theme == "light" ? Colors.text.textDark : Colors.text.textLight,
                    }}>
                    {`Hi, ${user.name}`}
                </Text>
            </View>
            <DayChangerContainer />
        </View>
    )
};


export default Header;
