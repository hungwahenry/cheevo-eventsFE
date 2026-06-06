import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CheckCircle2 } from 'lucide-react-native';
import { View } from 'react-native';

export function PaidState({ onContinue }: { onContinue: () => void }) {
  return (
    <View className="w-full max-w-sm gap-6">
      <View className="bg-muted/40 items-center gap-3 rounded-2xl p-8">
        <View className="size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Icon as={CheckCircle2} className="size-8 text-emerald-600" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-semibold">
          Tickets confirmed
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          Your tickets are ready in the Tickets tab. A confirmation email is on the way.
        </Text>
      </View>
      <Button size="lg" className="w-full" onPress={onContinue}>
        <Text>View my tickets</Text>
      </Button>
    </View>
  );
}
