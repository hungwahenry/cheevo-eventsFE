import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ChevronLeftIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSubscreen({ title, children }: Props) {
  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="flex-row items-center gap-1 px-3 pb-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          className="size-10 items-center justify-center">
          <Icon as={ChevronLeftIcon} className="text-foreground size-6" strokeWidth={2.25} />
        </Pressable>
        <Text className="text-foreground text-2xl font-bold tracking-tight">{title}</Text>
      </View>
      {children}
    </View>
  );
}
