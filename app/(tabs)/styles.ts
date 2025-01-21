import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white', // Ajusta según el diseño
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    greetingContainer: {
        width: '100%',
        padding: 10,
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
        fontSize: 16,
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
