import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export type UnderlinedTab<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type Props<T extends string> = {
  tabs: UnderlinedTab<T>[];
  value: T;
  onValueChange: (next: T) => void;
};

export function UnderlinedTabs<T extends string>({ tabs, value, onValueChange }: Props<T>) {
  return (
    <View className="border-border flex-row border-b">
      {tabs.map((tab) => {
        const focused = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onValueChange(tab.value)}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            className="flex-1 items-center">
            <View className="flex-row items-center gap-1.5 px-2 py-2.5">
              {tab.icon ? (
                <Icon
                  as={tab.icon}
                  className={focused ? 'text-foreground' : 'text-muted-foreground'}
                  size={15}
                  strokeWidth={2.25}
                />
              ) : null}
              <Text
                className={
                  focused
                    ? 'text-foreground text-sm font-sans-semibold'
                    : 'text-muted-foreground text-sm font-sans-medium'
                }>
                {tab.label}
              </Text>
            </View>
            <View
              className={focused ? 'bg-foreground h-0.5 w-full' : 'h-0.5 w-full bg-transparent'}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
