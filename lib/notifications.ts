import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type ExpoPushTokenResult =
  | { status: 'granted'; token: string; deviceId: string | null }
  | { status: 'denied' }
  | { status: 'unsupported' };

export function configureForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function setAppBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(Math.max(0, count));
  } catch {
    // Silently ignore — some platforms / sandboxes refuse badge updates.
  }
}

function projectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    undefined
  );
}

function deviceIdentifier(): string | null {
  return (
    (Device.osInternalBuildId as string | null) ??
    Device.modelId ??
    Device.modelName ??
    null
  );
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#FFFFFF',
  });
}

async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;

  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function requestExpoPushToken(): Promise<ExpoPushTokenResult> {
  if (!Device.isDevice) return { status: 'unsupported' };

  const granted = await ensureNotificationPermission();
  if (!granted) return { status: 'denied' };

  await ensureAndroidChannel();

  const id = projectId();
  const response = await Notifications.getExpoPushTokenAsync(id ? { projectId: id } : undefined);

  return {
    status: 'granted',
    token: response.data,
    deviceId: deviceIdentifier(),
  };
}

export async function getCurrentExpoPushToken(): Promise<string | null> {
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return null;

  const id = projectId();
  const response = await Notifications.getExpoPushTokenAsync(id ? { projectId: id } : undefined);
  return response.data;
}
