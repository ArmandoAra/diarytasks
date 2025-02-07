import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native';

import { ThemedView } from '../../Theme/themedView/themedView'
import { ThemedText } from '../../Theme/themedText/text'

const Loader = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color='blue' />
            <Text>Loading...</Text>
        </View>
    )
}

export default Loader;
