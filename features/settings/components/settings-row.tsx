import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

export function SettingsRow({ icon, label, subtitle, right, onPress, destructive }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-70">
      <Icon
        as={icon}
        className={destructive ? 'text-destructive' : 'text-muted-foreground'}
        size={20}
        strokeWidth={2}
      />
      <View className="min-w-0 flex-1">
        <Text
          className={
            destructive
              ? 'text-destructive text-sm font-medium'
              : 'text-foreground text-sm font-medium'
          }>
          {label}
        </Text>
        {subtitle ? (
          <Text className="text-muted-foreground text-xs">{subtitle}</Text>
        ) : null}
      </View>
      {right ?? (onPress ? (
        <Icon
          as={ChevronRightIcon}
          className="text-muted-foreground"
          size={18}
          strokeWidth={2}
        />
      ) : null)}
    </Pressable>
  );
}
