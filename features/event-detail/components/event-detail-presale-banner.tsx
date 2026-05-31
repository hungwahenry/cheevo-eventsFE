import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { formatShortDateTime } from '@/lib/format/datetime';
import { LockIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  presaleUntil: string;
  isRsvped: boolean;
};

export function EventDetailPresaleBanner({ presaleUntil, isRsvped }: Props) {
  const when = formatShortDateTime(presaleUntil) ?? 'soon';

  return (
    <View className="flex-row items-start gap-3 rounded-2xl bg-primary/10 p-4">
      <View className="bg-primary/15 mt-0.5 size-8 items-center justify-center rounded-full">
        <Icon as={LockIcon} className="text-primary size-4" strokeWidth={2.25} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-foreground text-sm font-semibold">
          {isRsvped ? "You're in early access" : 'RSVP-only presale'}
        </Text>
        <Text className="text-muted-foreground text-xs leading-5">
          {isRsvped
            ? `Public sale opens ${when}.`
            : `Tickets are RSVP-only until ${when}. Tap RSVP below to unlock.`}
        </Text>
      </View>
    </View>
  );
}
