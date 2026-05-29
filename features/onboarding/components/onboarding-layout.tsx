import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ArrowLeft } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

type OnboardingLayoutProps = {
  step: number; // 0-indexed
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  contentAlignment?: 'bottom' | 'fill';
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  contentAlignment = 'bottom',
  children,
  footer,
}: OnboardingLayoutProps) {
  const progress = Math.min(1, (step + 1) / totalSteps);

  const header = (
    <View className="flex-row items-center gap-3 py-2">
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          className="active:bg-muted size-10 items-center justify-center rounded-full">
          <Icon as={ArrowLeft} className="text-foreground size-6" strokeWidth={1.75} />
        </Pressable>
      ) : null}
      <View className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <View className="bg-primary h-full rounded-full" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );

  const heading = (
    <View className="gap-2 pt-1 pb-4">
      <Text variant="h1" className="text-foreground text-left text-3xl">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-muted-foreground text-base leading-6">{subtitle}</Text>
      ) : null}
    </View>
  );

  if (contentAlignment === 'fill') {
    return (
      <View className="bg-background pt-safe pb-safe flex-1 px-6">
        {header}
        {heading}
        <View className="flex-1 gap-4">{children}</View>
        <View className="pt-4">{footer}</View>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <View className="pt-safe px-6">{header}</View>

      <KeyboardAwareScrollView
        bottomOffset={90}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <View className="gap-4 px-6 pb-2">
          {heading}
          {children}
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView>
        <View className="pb-safe px-6 pt-3">{footer}</View>
      </KeyboardStickyView>
    </View>
  );
}
