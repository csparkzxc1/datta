import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { DattaSplash } from '@/components/brand/datta-splash';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/lib/auth-store';
import { queryClient } from '@/lib/query-client';
import { useDattaFonts } from '@/theme/use-fonts';

SplashScreen.preventAutoHideAsync();

const JS_SPLASH_DURATION_MS = 1600;

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useDattaFonts();
  const [showJsSplash, setShowJsSplash] = useState(true);
  const initializeAuth = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    SplashScreen.hideAsync();
    const timer = setTimeout(() => setShowJsSplash(false), JS_SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="child" options={{ headerShown: false }} />
          <Stack.Screen name="capsule" options={{ headerShown: false }} />
          <Stack.Screen name="backup" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
        {showJsSplash && <DattaSplash />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
