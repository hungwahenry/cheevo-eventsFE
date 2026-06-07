import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  title: string;
  hasMore: boolean;
  onSeeAll: () => void;
  children: React.ReactNode;
};

export function SearchSection({ title, hasMore, onSeeAll, children }: Props) {
  return (
    <View className="gap-1 pb-2">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Text className="text-muted-foreground text-xs font-sans-semibold tracking-wide uppercase">
          {title}
        </Text>
        {hasMore ? (
          <Pressable onPress={onSeeAll} hitSlop={10} className="flex-row items-center gap-0.5">
            <Text className="text-primary text-xs font-sans-semibold">See all</Text>
            <Icon as={ChevronRightIcon} className="text-primary" size={14} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}
