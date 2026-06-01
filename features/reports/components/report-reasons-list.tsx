import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import type { ReportReason } from '@/features/reports/types';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  reasons: ReportReason[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ReportReasonsList({ reasons, isLoading, selectedId, onSelect }: Props) {
  if (isLoading) {
    return (
      <View className="items-center py-10">
        <Spinner />
      </View>
    );
  }

  if (!reasons || reasons.length === 0) {
    return (
      <View className="px-5 py-10">
        <Text className="text-muted-foreground text-center text-sm">
          No reasons available right now.
        </Text>
      </View>
    );
  }

  return (
    <View className="py-2">
      {reasons.map((reason) => (
        <ReasonRow
          key={reason.id}
          reason={reason}
          selected={reason.id === selectedId}
          onPress={() => onSelect(reason.id)}
        />
      ))}
    </View>
  );
}

function ReasonRow({
  reason,
  selected,
  onPress,
}: {
  reason: ReportReason;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      className="flex-row items-start gap-3 px-5 py-3 active:opacity-70">
      <View
        className={`mt-0.5 size-5 items-center justify-center rounded-full border ${
          selected ? 'bg-primary border-primary' : 'border-input'
        }`}>
        {selected ? <Check className="size-3.5" color="white" strokeWidth={3} /> : null}
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-base">{reason.label}</Text>
        {reason.description ? (
          <Text className="text-muted-foreground mt-0.5 text-xs">{reason.description}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
