import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useChangeEmail } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { Mail } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

export default function ChangeEmailScreen() {
  const {
    user,
    stage,
    newEmail,
    setNewEmail,
    code,
    setCode,
    nextFactor,
    factorsTotal,
    factorIndex,
    isStarting,
    isVerifying,
    start,
    submitCode,
    resend,
  } = useChangeEmail();

  return (
    <SettingsSubscreen title="Change email">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        {stage === 'collect' ? (
          <View className="gap-4">
            <Text className="text-muted-foreground text-sm">
              Your current email is{' '}
              <Text className="text-foreground font-medium">{user?.email}</Text>. We&apos;ll send a
              code to your current email and then to your new one to confirm the change.
            </Text>
            <IconInput
              icon={Mail}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="you@email.com"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="go"
              onSubmitEditing={start}
            />
            <Button size="lg" className="w-full" disabled={isStarting} onPress={start}>
              {isStarting ? (
                <Spinner size="sm" barClassName="bg-primary-foreground" />
              ) : (
                <Text>Continue</Text>
              )}
            </Button>
          </View>
        ) : null}

        {stage === 'verify' && nextFactor ? (
          <View className="gap-4">
            <Text className="text-muted-foreground text-sm">
              Step {factorIndex} of {factorsTotal}. We sent a 6-digit code to{' '}
              <Text className="text-foreground font-medium">{nextFactor.target_masked}</Text>.
            </Text>
            <OtpInput
              value={code}
              onChangeText={setCode}
              onComplete={submitCode}
              autoFocus
            />
            <Pressable
              onPress={resend}
              hitSlop={8}
              className="self-center py-1"
              disabled={isVerifying}>
              <Text className="text-muted-foreground text-sm">
                Didn&apos;t get it?{' '}
                <Text className="text-primary text-sm font-semibold">Resend code</Text>
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SettingsSubscreen>
  );
}
