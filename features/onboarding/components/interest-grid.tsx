import { Spinner } from '@/components/ui/spinner';
import type { Interest } from '@/features/auth';
import { SelectChip } from '@/features/onboarding/components/select-chip';
import { View } from 'react-native';

type InterestGridProps = {
  interests: Interest[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  isLoading: boolean;
};

export function InterestGrid({ interests, selectedIds, onToggle, isLoading }: InterestGridProps) {
  if (isLoading) {
    return (
      <View className="mt-8 items-center">
        <Spinner size="md" />
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {interests.map((interest) => (
        <SelectChip
          key={interest.id}
          label={interest.name}
          selected={selectedIds.includes(interest.id)}
          onPress={() => onToggle(interest.id)}
        />
      ))}
    </View>
  );
}
