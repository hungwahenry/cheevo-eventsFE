import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MOTION } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Image, type ImageSource } from 'expo-image';
import type { LucideIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import { View, type ViewProps } from 'react-native';

type EmptyStateAction = {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  disabled?: boolean;
};

type EmptyStateProps = ViewProps & {
  icon?: LucideIcon;
  image?: ImageSource;
  title: string;
  description?: string;
  action?: EmptyStateAction;
};

export function EmptyState({
  icon,
  image,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={cn('items-center justify-center px-8 py-12', className)}
      {...props}>
      <MotiView
        from={{ opacity: 0, translateY: MOTION.entrance.distance }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={MOTION.entrance.transition}
        style={{ alignItems: 'center' }}>
        {image ? (
          <Image
            source={image}
            style={{ width: 96, height: 96 }}
            contentFit="contain"
          />
        ) : icon ? (
          <View className="bg-muted mb-1 size-14 items-center justify-center rounded-full">
            <Icon as={icon} className="text-muted-foreground size-7" />
          </View>
        ) : null}

        <Text className="text-foreground mt-3 text-center text-base font-sans-semibold">
          {title}
        </Text>

        {description ? (
          <Text className="text-muted-foreground mt-1 max-w-xs text-center text-sm leading-5">
            {description}
          </Text>
        ) : null}

        {action ? (
          <Button
            variant={action.variant ?? 'default'}
            onPress={action.onPress}
            disabled={action.disabled}
            className="mt-4">
            <Text>{action.label}</Text>
          </Button>
        ) : null}
      </MotiView>
    </View>
  );
}
