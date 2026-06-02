import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon, type LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

type Props = {
  icon: LucideIcon;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

export function SettingsRow({ icon, label, right, onPress, destructive }: Props) {
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
      <Text
        className={
          destructive
            ? 'text-destructive flex-1 text-sm font-medium'
            : 'text-foreground flex-1 text-sm font-medium'
        }>
        {label}
      </Text>
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
