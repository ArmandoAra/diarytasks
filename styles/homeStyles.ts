import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        backgroundColor: Colors.light.secondary,
        height: 80,
        fontSize: 24,
        fontWeight: 'bold',
        textAlignVertical: "bottom",
        paddingHorizontal: 7,
    },
    greeting: {
        fontSize: 18,
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10, // Puedes usar margenes si tu versión no soporta gap
    },
    date: {
        fontSize: 20,
    },
    selectDayButton: {
        backgroundColor: '#63b3ed', // Azul claro
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    selectDayButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default styles;