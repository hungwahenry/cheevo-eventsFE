import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Pressable } from 'react-native';

type SelectChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectChip({ label, selected, onPress }: SelectChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-full border px-4 py-2.5 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-input bg-background'
      )}>
      <Text
        className={cn(
          'text-sm font-sans-medium',
          selected ? 'text-primary-foreground' : 'text-foreground'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}
