import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type OptInRowProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function OptInRow({ checked, onChange, label }: OptInRowProps) {
  return (
    <Pressable onPress={() => onChange(!checked)} className="flex-row items-center gap-3">
      <View
        className={cn(
          'size-6 items-center justify-center rounded-md border',
          checked ? 'border-primary bg-primary' : 'border-input'
        )}>
        {checked ? (
          <Icon as={Check} className="text-primary-foreground size-4" strokeWidth={3} />
        ) : null}
      </View>
      <Text className="text-muted-foreground flex-1 text-sm">{label}</Text>
    </Pressable>
  );
}
