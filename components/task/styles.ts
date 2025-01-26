import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: "#1e293b",
        borderRadius: 8,
        padding: 5,
        marginBottom: 10,
    },
    taskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "bold",
        color: "#fff",
    },
    priorityLevel: {
        backgroundColor: "#f87171",
        fontSize: 12,
        textAlign: "center",
        padding: 2,

        borderRadius: 8,
        paddingHorizontal: 5,
        color: "#fff",
    },
    description: {
        fontSize: 14,
        marginLeft: 10,
        color: "#cbd5e1",
        marginTop: 8,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 30,
        marginTop: 8,
    },
    actionText: {
        fontSize: 14,
        color: "#60a5fa",
    },
    actionTextHint: {
        display: "flex",
        alignItems: "flex-end",
        position: "relative",
        fontSize: 10,
        color: "#909090",
    },
});