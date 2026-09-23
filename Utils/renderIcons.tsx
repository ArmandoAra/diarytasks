import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';

import { Status } from '@/interfaces/TasksInterfaces';

const ICON_SIZE = 24;

/**
 * Check mark for completed tasks, or an equally sized spacer so the row layout
 * does not shift between states.
 *
 * This is a real component rather than a function returning JSX: it used to be
 * called as `StatusIcon(status)` and rendered inside a `<Text>`, which is
 * invalid nesting for a `<View>` in React Native.
 */
export const StatusIcon = ({ status }: { status: Status }) => {
    if (status === 'Completed') {
        return <Feather name="check-circle" size={ICON_SIZE} color="green" />;
    }

    return <View style={{ width: ICON_SIZE, height: ICON_SIZE }} />;
};
