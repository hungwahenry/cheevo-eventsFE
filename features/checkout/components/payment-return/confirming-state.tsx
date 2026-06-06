import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function ConfirmingState() {
  return (
    <View className="items-center gap-4">
      <Spinner size="lg" />
      <Text className="text-foreground text-lg font-semibold">Confirming payment</Text>
      <Text className="text-muted-foreground text-center text-sm">
        Hang on — we&apos;re checking with your bank.
      </Text>
    </View>
  );
}
