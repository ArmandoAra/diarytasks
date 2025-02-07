// Icons
import Feather from '@expo/vector-icons/Feather';
import { View } from "react-native";


// Icons
export const StatusIcon = (status: "Completed" | "ToDo") => {
    if (status == "Completed") {
        return <Feather name="check-circle" size={24} color="green" />
    }
    return <View style={{ width: 24, height: 24 }}></View>
}