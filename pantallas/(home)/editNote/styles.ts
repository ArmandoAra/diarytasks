import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        alignContent: "space-around",
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        alignContent: 'flex-start',
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    picker: {
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    createTaskButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: 15,
        height: 50,
        marginTop: 20,
        marginBottom: 40,
    },
    createTaskButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 'auto',
    },
});

export default styles;