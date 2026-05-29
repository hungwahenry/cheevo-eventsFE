import * as Haptics from 'expo-haptics';

// Haptics are best-effort — unsupported on web and some devices, so never let
// a failed buzz throw into the calling flow.
function run(action: () => Promise<unknown>): void {
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
