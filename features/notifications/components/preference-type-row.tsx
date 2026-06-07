import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import type {
  NotificationChannelKey,
  NotificationTypeOption,
} from '@/features/notifications/types';
import { View } from 'react-native';

type Props = {
  type: NotificationTypeOption;
  onToggle: (channel: NotificationChannelKey, enabled: boolean) => void;
};

export function PreferenceTypeRow({ type, onToggle }: Props) {
  return (
    <View className="border-border gap-3 border-b px-5 py-4">
      <View className="gap-1">
        <Text className="text-foreground text-sm font-sans-semibold">{type.label}</Text>
        <Text className="text-muted-foreground text-xs">{type.description}</Text>
      </View>
      <View className="flex-row flex-wrap items-center gap-4">
        {type.channels.map((channel) => (
          <View key={channel.channel} className="flex-row items-center gap-2">
            <Switch
              checked={channel.enabled}
              onCheckedChange={(value) => onToggle(channel.channel, value)}
            />
            <Text className="text-foreground text-xs font-sans-medium">{channel.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
