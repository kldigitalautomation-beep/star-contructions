import { Stack } from 'expo-router';

export default function BuildingModuleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    />
  );
}