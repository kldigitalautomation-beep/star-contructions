import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../utils/appState';
import { ThemeProvider } from '../utils/themeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}