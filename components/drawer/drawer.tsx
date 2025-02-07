import React, { useRef, useState } from 'react';
import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';

const AppDrawer = () => {
    const drawer = useRef<DrawerLayoutAndroid>(null);
    const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
        'right',
    );
    const changeDrawerPosition = () => {
        if (drawerPosition === 'left') {
            setDrawerPosition('right');
        } else {
            setDrawerPosition('left');
        }
    };

    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            <Text style={styles.paragraph}>I'm in the Drawer!</Text>
            <TouchableOpacity
                onPress={() => drawer.current?.closeDrawer()}
            >
                <AntDesign name="menu-fold" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={drawerPosition}
            style={{ position: "relative", width: "100%", height: 120, top: 0, right: 0, backgroundColor: "red", }}
            renderNavigationView={navigationView}>
            <TouchableOpacity
                style={{ position: "absolute", right: 30, top: 30 }}
                onPress={() => drawer.current?.openDrawer()}
            >
                <AntDesign name="menufold" size={24} color="black" />
            </TouchableOpacity>
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center',
    },
});

export default AppDrawer;