import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AuthLayout, useVerifyForm } from '@/features/auth';
import { useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { control, errors, canSubmit, submit, resend, isVerifying, isResending } = useVerifyForm(
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
              <ActivityIndicator colorClassName="accent-primary-foreground" />
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
      <View className="gap-1.5">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextInput
              value={field.value}
              onChangeText={(text) => {
                field.onChange(text);
                if (text.length === 6) {
                  submit();
                }
              }}
              onBlur={field.onBlur}
              placeholder="••••••"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={submit}
              style={{ textAlignVertical: 'center', includeFontPadding: false }}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground h-16 rounded-3xl border text-center text-[30px] font-semibold tracking-[16px]"
            />
          )}
        />
        {errors.code ? (
          <Text className="text-destructive ml-2 text-sm">{errors.code.message}</Text>
        ) : null}
      </View>
    </AuthLayout>
  );
}
