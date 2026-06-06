import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { XCircle } from 'lucide-react-native';
import { View } from 'react-native';

export function CancelledState({ onContinue }: { onContinue: () => void }) {
  return (
    <View className="w-full max-w-sm gap-6">
      <View className="bg-muted/40 items-center gap-3 rounded-2xl p-8">
        <View className="size-16 items-center justify-center rounded-full bg-amber-500/10">
          <Icon as={XCircle} className="size-8 text-amber-600" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-semibold">
          Checkout cancelled
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          Your seats have been released. You can try again any time.
        </Text>
      </View>
      <Button size="lg" className="w-full" onPress={onContinue}>
        <Text>Back to event</Text>
      </Button>
    </View>
  );
}
