import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  /** Optional content (brand/illustration) shown centered in the space above the header. */
  media?: React.ReactNode;
  /** Inputs / form fields. */
  children?: React.ReactNode;
  /** Bottom call-to-action(s). */
  footer: React.ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  showBack,
  media,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="bg-background pt-safe pb-safe flex-1 px-6">
        {showBack ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="active:bg-muted mt-1 size-11 items-center justify-center rounded-full">
            <Icon as={ArrowLeft} className="text-foreground size-6" strokeWidth={1.75} />
          </Pressable>
        ) : null}

        <View className="flex-1 items-center justify-center">{media}</View>

        <View className="gap-2 pb-6">
          <Text variant="h1" className="text-foreground text-left text-3xl">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-muted-foreground text-base leading-6">{subtitle}</Text>
          ) : null}
        </View>

        {children ? <View className="gap-4">{children}</View> : null}

        <View className="mt-5">{footer}</View>
      </View>
    </KeyboardAvoidingView>
  );
}
