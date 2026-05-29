import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { Text } from '@/components/ui/text';
import { AvatarPicker } from '@/features/onboarding/components/avatar-picker';
import { Field } from '@/features/onboarding/components/field';
import { OnboardingLayout } from '@/features/onboarding/components/onboarding-layout';
import { UsernameField } from '@/features/onboarding/components/username-field';
import { useProfileStep } from '@/features/onboarding/hooks';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

export function ProfileStep() {
  const {
    control,
    errors,
    avatarUri,
    avatarSeed,
    pickAvatar,
    usernameStatus,
    canContinue,
    onContinue,
  } = useProfileStep();

  return (
    <OnboardingLayout
      step={0}
      totalSteps={4}
      title="Set up your profile"
      subtitle="This is how you'll show up on cheevo."
      footer={
        <Button size="lg" className="w-full" disabled={!canContinue} onPress={onContinue}>
          <Text>Continue</Text>
        </Button>
      }>
      <View className="flex-row items-start gap-3">
        <AvatarPicker uri={avatarUri} seed={avatarSeed} onPress={pickAvatar} />
        <View className="flex-1">
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Field error={errors.username?.message}>
                <UsernameField
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  status={usernameStatus}
                />
              </Field>
            )}
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Field error={errors.firstName?.message}>
                <IconInput
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="First name"
                  autoCapitalize="words"
                />
              </Field>
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Field error={errors.lastName?.message}>
                <IconInput
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Last name"
                  autoCapitalize="words"
                />
              </Field>
            )}
          />
        </View>
      </View>
    </OnboardingLayout>
  );
}
