import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export function SheetHeader({ title, subtitle }: Props) {
  return (
    <View className="border-border border-b px-5 pb-3">
      <Text className="text-foreground text-base font-semibold">{title}</Text>
      {subtitle ? (
        <Text className="text-muted-foreground mt-0.5 text-xs">{subtitle}</Text>
      ) : null}
    </View>
  );
}
