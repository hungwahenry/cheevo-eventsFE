import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

export function FailedState({ onContinue }: { onContinue: () => void }) {
  return (
    <View className="w-full max-w-sm gap-6">
      <View className="bg-destructive/5 items-center gap-3 rounded-2xl p-8">
        <View className="bg-destructive/10 size-16 items-center justify-center rounded-full">
          <Icon as={TriangleAlert} className="text-destructive size-8" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-sans-semibold">
          We couldn&apos;t confirm
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          We didn&apos;t hear back from your bank. If your card was charged, we&apos;ll
          automatically refund it within 24 hours.
        </Text>
      </View>
      <Button size="lg" className="w-full" onPress={onContinue}>
        <Text>Back</Text>
      </Button>
    </View>
  );
}
