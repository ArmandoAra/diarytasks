import React, { forwardRef, HtmlHTMLAttributes, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    Button,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Alert,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

//interfaces
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate } from '@/Utils/helpFunctions';
import { createTask, getTasksByDate } from '@/db/taskDb';
import { useGlobalContext } from '@/context/GlobalProvider';




const FavoritesTab = () => {

    return (
        <View>
            <Text style={{ color: "black", marginTop: 70 }}>Favorites</Text>
        </View>
    );
};

export default FavoritesTab;

