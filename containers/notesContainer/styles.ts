import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4c1d95', // violet-950
        borderRadius: 16,
        padding: 15,
        width: "100%",
        marginVertical: 10,
        marginHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#86efac', // green-200
        padding: 10,
        width: '15%',
        borderRadius: 12,
    },
    addButtonText: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
    },
    notesContainer: {
        gap: 10, // Cambiar por márgenes si gap no es compatible
    },
    note: {
        backgroundColor: '#4338ca', // indigo-900
        borderRadius: 12,
        padding: 15,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    noteTitle: {
        fontSize: 16,
        color: '#fff',
    },
    noteStar: {
        fontSize: 16,
        color: '#ffd700', // Gold
    },
    noteText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10, // Cambiar por márgenes si gap no es compatible
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
    },
});