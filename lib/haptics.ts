import { usePreferencesStore } from '@/lib/preferences';
import * as Haptics from 'expo-haptics';

function run(action: () => Promise<unknown>): void {
  if (!usePreferencesStore.getState().hapticsEnabled) return;
  action().catch(() => {});
}

export const haptics = {
  select: () => run(() => Haptics.selectionAsync()),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  impact: (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) =>
    run(() => Haptics.impactAsync(style)),
};
