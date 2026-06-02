import { NotificationPreferencesPanel } from '@/features/notifications/components/notification-preferences-panel';
import { SettingsSubscreen } from '@/features/settings';

export default function NotificationsSettingsScreen() {
  return (
    <SettingsSubscreen title="Notifications">
      <NotificationPreferencesPanel />
    </SettingsSubscreen>
  );
}
