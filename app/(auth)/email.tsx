import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconInput } from '@/components/ui/icon-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { AuthLayout, useEmailForm } from '@/features/auth';
import { openLegalPage } from '@/lib/legal';
import { ArrowRight, Mail } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

export default function EmailScreen() {
  const { control, canSubmit, submit, isPending } = useEmailForm();

  return (
    <AuthLayout
      showBack
      title="What's your email?"
      subtitle="We'll email you a 6-digit code to verify it's you."
      footer={
        <View className="gap-3">
          <Button size="lg" className="w-full" disabled={!canSubmit || isPending} onPress={submit}>
            <Text>Continue</Text>
            {isPending ? (
              <Spinner size="sm" barClassName="bg-primary-foreground" />
            ) : (
              <Icon as={ArrowRight} className="text-primary-foreground size-5" strokeWidth={2} />
            )}
          </Button>
          <Text className="text-muted-foreground text-center text-xs leading-5">
            By continuing you agree to our{' '}
            <Text
              className="text-foreground text-xs font-sans-medium underline"
              onPress={() => openLegalPage('terms')}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text
              className="text-foreground text-xs font-sans-medium underline"
              onPress={() => openLegalPage('privacy')}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      }>
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
    </AuthLayout>
  );
}
