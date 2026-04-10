import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onSurface,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
        <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      </Stack>
    </>
  );
}
