import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function CommentsSheetHeader({ count }: { count: number }) {
  const label =
    count > 0
      ? `${count.toLocaleString()} ${count === 1 ? 'comment' : 'comments'}`
      : 'Comments';

  return (
    <View className="border-border border-b px-5 pb-3">
      <Text className="text-foreground text-base font-semibold">{label}</Text>
    </View>
  );
}
