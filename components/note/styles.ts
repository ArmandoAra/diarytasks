import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        gap: 40,
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
    },
});
