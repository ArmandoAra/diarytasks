import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useColorScheme as useRNColorScheme } from 'react-native';


const NotesContainer = () => {

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Daily Notes</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("./createNote")}
                    accessibilityLabel="Create New Note">
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Contenedor de Notas */}
            <View style={styles.notesContainer}>
                {/* Nota 1 */}
                <View style={styles.note}>
                    <View style={styles.noteHeader}>
                        <Text style={styles.noteTitle}>Titulo de la Nota</Text>
                        <Text style={styles.noteStar}>⭐</Text>
                    </View>
                    <View>
                        <Text style={styles.noteText}>Hoy ha sido un día muy bonito</Text>
                        <Text style={styles.noteText}>También fui a la playa</Text>
                        <Text style={styles.noteText}>Estuve nadando todo el día</Text>
                        <Text style={styles.noteText}>Después me tomé una caipiriña</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity>
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Nota 2 */}
                <View style={styles.note}>
                    <View style={styles.noteHeader}>
                        <Text style={styles.noteTitle}>Titulo de la Nota</Text>
                        <Text style={styles.noteStar}>⭐</Text>
                    </View>
                    <View>
                        <Text style={styles.noteText}>Hoy ha sido un día muy bonito</Text>
                        <Text style={styles.noteText}>También fui a la playa</Text>
                        <Text style={styles.noteText}>Estuve nadando todo el día</Text>
                        <Text style={styles.noteText}>Después me tomé una caipiriña</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity>
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default NotesContainer;
