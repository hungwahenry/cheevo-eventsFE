import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { AuthLayout, useVerifyForm } from '@/features/auth';
import { useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { control, canSubmit, submit, resend, isVerifying, isResending } = useVerifyForm(
    email ?? ''
  );

  return (
    <AuthLayout
      showBack
      title="Enter your code"
      subtitle={`We sent a 6-digit code to ${email ?? 'your email'}.`}
      footer={
        <View className="gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={!canSubmit || isVerifying}
            onPress={submit}>
            <Text>Verify</Text>
            {isVerifying ? (
              <Spinner size="sm" barClassName="bg-primary-foreground" />
            ) : (
              <Icon as={Check} className="text-primary-foreground size-5" strokeWidth={2.25} />
            )}
          </Button>
          <Pressable
            onPress={resend}
            disabled={isResending}
            hitSlop={8}
            className="self-center py-1">
            <Text className="text-muted-foreground text-sm">
              Didn&apos;t get it?{' '}
              <Text className="text-primary text-sm font-semibold">Resend code</Text>
            </Text>
          </Pressable>
        </View>
      }>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChangeText={field.onChange}
            onComplete={() => submit()}
            autoFocus
          />
        )}
      />
    </AuthLayout>
  );
}
