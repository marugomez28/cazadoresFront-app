import { Stack } from 'expo-router';
import { HunterProvider } from './context/HunterContext';

export default function RootLayout() {
  return (
    <HunterProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </HunterProvider>
  );
}