import '@/global.css';

import { OfflineBanner } from '@/components/offline-banner';
import { OfflineScreen } from '@/components/offline-screen';
import {
  useAuthBootstrap,
  useSentryAttribution,
  useSessionStore,
} from '@/features/auth';
import {
  useBadgeSync,
  useNotificationResponseListener,
  usePushTokenRegistration,
} from '@/features/notifications';
import { useSystemBootstrap } from '@/features/system/hooks';
import { NetworkProvider, useNetwork } from '@/lib/network';
import { configureForegroundHandler } from '@/lib/notifications';
import { queryClient } from '@/lib/query';
import { bindReactQueryFocusToAppState } from '@/lib/react-query-focus';
import { NAV_THEME } from '@/lib/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from '@expo-google-fonts/geist';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import * as Sentry from '@sentry/react-native';
import { Uniwind, useUniwind } from 'uniwind';

export { AppErrorBoundary as ErrorBoundary } from '@/components/error-boundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  environment: __DEV__ ? 'development' : 'production',
  sendDefaultPii: false,
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

configureForegroundHandler();

function NotificationsRuntime() {
  useBadgeSync();
  return null;
}

function RootLayout() {
  const { theme } = useUniwind();

  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
  });

  useAuthBootstrap();
  useSystemBootstrap();
  usePushTokenRegistration();
  useNotificationResponseListener();
  useSentryAttribution();

  useEffect(() => {
    Uniwind.setTheme('system');
  }, []);

  useEffect(() => bindReactQueryFocusToAppState(), []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <NetworkProvider>
            <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
              <QueryClientProvider client={queryClient}>
                <NotificationsRuntime />
                <BottomSheetModalProvider>
                  <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                    <NetworkGate>
                      <Stack screenOptions={{ headerShown: false }} />
                      <OfflineBanner />
                    </NetworkGate>
                    <PortalHost />
                    <Toaster richColors />
                  </ThemeProvider>
                </BottomSheetModalProvider>
              </QueryClientProvider>
            </SafeAreaListener>
          </NetworkProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function NetworkGate({ children }: { children: ReactNode }) {
  const { isOnline, hasEverBeenOnline } = useNetwork();
  const isOfflineCold = !isOnline && !hasEverBeenOnline;
  useSplashGate(isOfflineCold);
  if (isOfflineCold) return <OfflineScreen />;
  return <>{children}</>;
}

function useSplashGate(isOfflineCold: boolean) {
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status !== 'loading' || isOfflineCold) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status, isOfflineCold]);

  useEffect(() => {
    const t = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 5000);
    return () => clearTimeout(t);
  }, []);
}

export default Sentry.wrap(RootLayout);
