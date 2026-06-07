import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function PayingState({ onCancel }: { onCancel: () => void }) {
  return (
    <View className="w-full max-w-sm items-center gap-6">
      <View className="items-center gap-4">
        <Spinner size="lg" />
        <Text className="text-foreground text-lg font-sans-semibold">Waiting for payment</Text>
        <Text className="text-muted-foreground text-center text-sm">
          Complete the payment in the browser. We&apos;ll bring you back automatically.
        </Text>
      </View>
      <Button variant="ghost" size="lg" onPress={onCancel}>
        <Text>Cancel checkout</Text>
      </Button>
    </View>
  );
}
