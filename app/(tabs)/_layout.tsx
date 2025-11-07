import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'BD Relacional',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'server' : 'server-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'BD No Relacional',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cloud' : 'cloud-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}