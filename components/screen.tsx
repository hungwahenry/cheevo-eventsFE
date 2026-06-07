import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';

type ScreenProps = ViewProps & {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  scroll?: boolean;
  contentClassName?: string;
};

export function Screen({
  title,
  subtitle,
  rightAction,
  scroll = false,
  className,
  contentClassName,
  children,
  ...props
}: ScreenProps) {
  const header =
    title || subtitle || rightAction ? (
      <View className="flex-row items-start justify-between px-5 pt-2 pb-4">
        <View className="min-w-0 flex-1 gap-1">
          {title ? (
            <Text className="text-foreground text-3xl font-sans-bold tracking-tight">{title}</Text>
          ) : null}
          {subtitle ? (
            <Text className="text-muted-foreground text-sm">{subtitle}</Text>
          ) : null}
        </View>
        {rightAction ? <View className="pl-3">{rightAction}</View> : null}
      </View>
    ) : null;

  if (scroll) {
    return (
      <View className={cn('bg-background pt-safe-offset-2 flex-1', className)} {...props}>
        {header}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 96 }}
          className={contentClassName}>
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={cn('bg-background pt-safe-offset-2 flex-1', className)} {...props}>
      {header}
      {children}
    </View>
  );
}
