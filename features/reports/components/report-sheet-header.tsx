import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function ReportSheetHeader({ noun }: { noun: string }) {
  return (
    <View className="border-border border-b px-5 pb-3">
      <Text className="text-foreground text-base font-semibold">Report {noun}</Text>
      <Text className="text-muted-foreground mt-0.5 text-xs">
        Reports are private. Our team reviews each one.
      </Text>
    </View>
  );
}
