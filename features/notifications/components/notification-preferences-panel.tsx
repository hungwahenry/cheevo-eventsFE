import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { PreferenceTypeRow } from '@/features/notifications/components/preference-type-row';
import { QuietHoursSection } from '@/features/notifications/components/quiet-hours-section';
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from '@/features/notifications/hooks';
import { ScrollView, View } from 'react-native';

export function NotificationPreferencesPanel() {
  const { data, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreference();

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Spinner />
      </View>
    );
  }

  const attendeeTypes = data.types.filter((t) => t.audience === 'attendee');

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
      <View className="border-border border-b">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            What to send
          </Text>
        </View>
        {attendeeTypes.map((type) => (
          <PreferenceTypeRow
            key={type.type}
            type={type}
            onToggle={(channel, enabled) =>
              update.mutate({ type: type.type, channel, enabled })
            }
          />
        ))}
      </View>

      <View>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            When to send
          </Text>
        </View>
        <QuietHoursSection initial={data.quiet_hours} />
      </View>
    </ScrollView>
  );
}
