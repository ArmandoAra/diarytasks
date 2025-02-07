import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabScreens() {
  return (
    <Tabs screenOptions={{ tabBarStyle: { height: 60 } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen name="createTask" options={{ title: 'Create Task' }} />
      <Tabs.Screen name="editTask/[id]" options={{ href: null }} /> {/* Oculta en el Tab Bar */}
    </Tabs>
  );
}
