import '@/global.css';

import { useAuthBootstrap } from '@/features/auth';
import {
  useBadgeSync,
  useNotificationResponseListener,
  usePushTokenRegistration,
} from '@/features/notifications';
import { useSystemBootstrap } from '@/features/system/hooks';
import { configureForegroundHandler } from '@/lib/notifications';
import { queryClient } from '@/lib/query';
import { NAV_THEME } from '@/lib/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { Uniwind, useUniwind } from 'uniwind';

export {
  ErrorBoundary,
} from 'expo-router';

configureForegroundHandler();

function NotificationsRuntime() {
  useBadgeSync();
  return null;
}

export default function RootLayout() {
  const { theme } = useUniwind();

  useAuthBootstrap();
  useSystemBootstrap();
  usePushTokenRegistration();
  useNotificationResponseListener();

  useEffect(() => {
    Uniwind.setTheme('system');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
            <QueryClientProvider client={queryClient}>
              <NotificationsRuntime />
              <BottomSheetModalProvider>
                <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
                  <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                  <Stack screenOptions={{ headerShown: false }} />
                  <PortalHost />
                  <Toaster richColors />
                </ThemeProvider>
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </SafeAreaListener>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
