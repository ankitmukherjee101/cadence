import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Literata_400Regular, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProviders } from '@/src/shared/providers/AppProviders';
import { DatabaseProvider } from '@/src/shared/providers/DatabaseProvider';
import { SessionLifecycleProvider } from '@/src/shared/providers/SessionLifecycleProvider';
import { colors } from '@/src/shared/ui/tokens';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const CadenceDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Literata_400Regular,
    Literata_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProviders>
      <DatabaseProvider>
        <SessionLifecycleProvider>
          <ThemeProvider value={CadenceDarkTheme}>
            <StatusBar style="light" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="session/active"
                options={{ headerShown: false, presentation: 'fullScreenModal' }}
              />
              <Stack.Screen name="journal/[id]" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </SessionLifecycleProvider>
      </DatabaseProvider>
    </AppProviders>
  );
}
