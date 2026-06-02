import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth';
import { AvatarPicker } from '@/features/onboarding/components/form-fields/avatar-picker';
import { UsernameField } from '@/features/onboarding/components/form-fields/username-field';
import { OnboardingLayout } from '@/features/onboarding/components/onboarding-layout';
import { useProfileStep } from '@/features/onboarding/hooks';
import { UserRound } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

export function ProfileStep() {
  const { control, avatarUri, avatarSeed, pickAvatar, usernameStatus, canContinue, onContinue } =
    useProfileStep();
  const { signOut } = useSignOut();

  return (
    <OnboardingLayout
      icon={UserRound}
      onLogout={signOut}
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
              <UsernameField
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                status={usernameStatus}
              />
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
              <IconInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="First name"
                autoCapitalize="words"
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <IconInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Last name"
                autoCapitalize="words"
              />
            )}
          />
        </View>
      </View>
    </OnboardingLayout>
  );
}
