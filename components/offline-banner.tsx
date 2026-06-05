import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNetwork } from '@/lib/network';
import { WifiOff } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { isOnline } = useNetwork();

  if (isOnline) return null;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-destructive absolute left-0 right-0 top-0 z-50">
      <View className="flex-row items-center justify-center gap-2 px-4 py-2">
        <Icon as={WifiOff} className="size-4 text-white" />
        <Text className="text-sm font-medium text-white">No internet connection</Text>
      </View>
    </View>
  );
}
