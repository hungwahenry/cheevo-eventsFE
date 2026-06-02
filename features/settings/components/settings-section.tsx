import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  return (
    <View className="pt-5">
      {title ? (
        <Text className="text-muted-foreground px-5 pb-2 text-xs font-semibold tracking-wide uppercase">
          {title}
        </Text>
      ) : null}
      <View className="bg-muted divide-border/60 mx-4 divide-y overflow-hidden rounded-2xl">
        {children}
      </View>
    </View>
  );
}
