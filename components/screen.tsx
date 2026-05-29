import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ScrollView, View, type ViewProps } from 'react-native';

type ScreenProps = ViewProps & {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  contentClassName?: string;
};

export function Screen({
  title,
  subtitle,
  scroll = false,
  className,
  contentClassName,
  children,
  ...props
}: ScreenProps) {
  const header =
    title || subtitle ? (
      <View className="mb-6 gap-1">
        {title ? (
          <Text className="text-foreground text-3xl font-bold tracking-tight">{title}</Text>
        ) : null}
        {subtitle ? <Text className="text-muted-foreground">{subtitle}</Text> : null}
      </View>
    ) : null;

  if (scroll) {
    return (
      <View className={cn('bg-background pt-safe-offset-6 flex-1', className)} {...props}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 96 }}
          className={contentClassName}>
          {header}
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={cn('bg-background pt-safe-offset-2 flex-1 px-2', className)} {...props}>
      {header}
      {children}
    </View>
  );
}
