import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ArrowLeft, LogOut, type LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

type OnboardingLayoutProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function OnboardingLayout({
  icon,
  title,
  subtitle,
  onBack,
  onLogout,
  children,
  footer,
}: OnboardingLayoutProps) {
  return (
    <View className="bg-background flex-1">
      <View className="pt-safe px-6">
        <View className="h-12 flex-row items-center">
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              className="active:bg-muted -ml-2.5 size-10 items-center justify-center rounded-full">
              <Icon as={ArrowLeft} className="text-foreground size-6" strokeWidth={1.75} />
            </Pressable>
          ) : onLogout ? (
            <Pressable
              onPress={onLogout}
              hitSlop={12}
              className="active:bg-muted -ml-2.5 size-10 items-center justify-center rounded-full">
              <Icon as={LogOut} className="text-muted-foreground size-5" strokeWidth={1.75} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={90}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <View className="gap-5 px-6 pt-3 pb-2">
          <View className="bg-primary/10 size-14 items-center justify-center rounded-2xl">
            <Icon as={icon} className="text-primary size-7" strokeWidth={1.75} />
          </View>

          <View className="gap-2">
            <Text variant="h1" className="text-foreground text-left text-3xl">
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-muted-foreground text-base leading-6">{subtitle}</Text>
            ) : null}
          </View>

          <View className="gap-4">{children}</View>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView>
        <View className="pb-safe px-6 pt-3">{footer}</View>
      </KeyboardStickyView>
    </View>
  );
}
