import type { Interest } from '@/features/auth';
import { SelectChip } from '@/features/onboarding/components/select-chip';
import { ActivityIndicator, ScrollView } from 'react-native';

type InterestGridProps = {
  interests: Interest[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  isLoading: boolean;
};

export function InterestGrid({ interests, selectedIds, onToggle, isLoading }: InterestGridProps) {
  if (isLoading) {
    return <ActivityIndicator colorClassName="accent-primary" className="mt-8" />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="flex-row flex-wrap gap-2 pb-2">
      {interests.map((interest) => (
        <SelectChip
          key={interest.id}
          label={interest.name}
          selected={selectedIds.includes(interest.id)}
          onPress={() => onToggle(interest.id)}
        />
      ))}
    </ScrollView>
  );
}
