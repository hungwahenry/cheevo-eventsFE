import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconInput } from '@/components/ui/icon-input';
import { Text } from '@/components/ui/text';
import { AuthLayout, useEmailForm } from '@/features/auth';
import { ArrowRight, Mail } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';

export default function EmailScreen() {
  const { control, errors, submit, isPending } = useEmailForm();

  return (
    <AuthLayout
      showBack
      title="What's your email?"
      subtitle="We'll email you a 6-digit code to verify it's you."
      footer={
        <Button size="lg" className="w-full" disabled={isPending} onPress={submit}>
          <Text>Continue</Text>
          {isPending ? (
            <ActivityIndicator colorClassName="accent-primary-foreground" />
          ) : (
            <Icon as={ArrowRight} className="text-primary-foreground size-5" strokeWidth={2} />
          )}
        </Button>
      }>
      <View className="gap-1.5">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <IconInput
              icon={Mail}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          )}
        />
        {errors.email ? (
          <Text className="text-destructive ml-5 text-sm">{errors.email.message}</Text>
        ) : null}
      </View>
    </AuthLayout>
  );
}
