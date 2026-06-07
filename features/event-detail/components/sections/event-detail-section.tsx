import { Text } from '@/components/ui/text';
import type { ReactNode } from 'react';
import { View } from 'react-native';

export function EventDetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-foreground text-base font-sans-semibold">{title}</Text>
      {children}
    </View>
  );
}
