import { Tabs } from 'expo-router';

export default function TabScreens() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="createTask" options={{ title: 'Create Task' }} />
            <Tabs.Screen name="editTask/[id]" options={{ href: null }} />
        </Tabs>
    );
}