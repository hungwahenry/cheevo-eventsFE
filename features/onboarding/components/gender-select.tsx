import type { Gender } from '@/features/auth';
import { SelectChip } from '@/features/onboarding/components/select-chip';
import { View } from 'react-native';

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

type GenderSelectProps = {
  value: Gender | null;
  onSelect: (value: Gender) => void;
};

export function GenderSelect({ value, onSelect }: GenderSelectProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <SelectChip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onSelect(option.value)}
        />
      ))}
    </View>
  );
}
