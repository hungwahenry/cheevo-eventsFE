import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
}: QuantityStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handle = (delta: number) => {
    const next = value + delta;
    if (next < min || next > max) return;
    haptics.select();
    onChange(next);
  };

  return (
    <View className="flex-row items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={!canDecrement}
        onPress={() => handle(-1)}>
        <Icon as={Minus} className="text-foreground size-4" strokeWidth={2.25} />
      </Button>
      <Text className="text-foreground w-6 text-center text-base font-semibold">
        {value}
      </Text>
      <Button
        variant="outline"
        size="icon"
        disabled={!canIncrement}
        onPress={() => handle(1)}>
        <Icon as={Plus} className="text-foreground size-4" strokeWidth={2.25} />
      </Button>
    </View>
  );
}
