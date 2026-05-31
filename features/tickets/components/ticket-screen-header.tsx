import { Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function TicketScreenHeader() {
  return (
    <View className="px-4 pt-safe-offset-2 pb-2">
      <Pressable onPress={() => router.back()} hitSlop={12} className="self-start">
        <View className="bg-muted size-9 items-center justify-center rounded-full">
          <Icon as={ChevronLeft} className="text-foreground size-5" strokeWidth={2.25} />
        </View>
      </Pressable>
    </View>
  );
}
