import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Clock } from 'lucide-react-native';
import { View } from 'react-native';

export function PendingState({ onContinue }: { onContinue: () => void }) {
  return (
    <View className="w-full max-w-sm gap-6">
      <View className="bg-muted/40 items-center gap-3 rounded-2xl p-8">
        <View className="bg-primary/10 size-16 items-center justify-center rounded-full">
          <Icon as={Clock} className="text-primary size-8" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-sans-semibold">
          Payment received
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          We&apos;re finishing up with your bank. You&apos;ll get a notification the moment
          your tickets are ready — usually within a minute.
        </Text>
      </View>
      <Button size="lg" className="w-full" onPress={onContinue}>
        <Text>Done</Text>
      </Button>
    </View>
  );
}
