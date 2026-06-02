import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useCurrentUser, useSessionStore } from '@/features/auth';
import { SettingsSubscreen } from '@/features/settings';
import { useStepUp } from '@/features/step-up';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChangeEmailScreen() {
  const user = useCurrentUser();
  const setUser = useSessionStore((s) => s.setUser);
  const stepUp = useStepUp();

  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');

  const stage =
    stepUp.status === 'completed'
      ? 'done'
      : stepUp.challenge && !stepUp.challenge.completed
      ? 'verify'
      : 'collect';

  const emailValid = EMAIL_REGEX.test(newEmail.trim().toLowerCase());
  const isSameAsCurrent =
    newEmail.trim().toLowerCase() === (user?.email ?? '').trim().toLowerCase();

  const start = async () => {
    if (!emailValid) {
      haptics.error();
      toast.error('Enter a valid email.');
      return;
    }
    if (isSameAsCurrent) {
      haptics.error();
      toast.error('That is already your email.');
      return;
    }
    try {
      await stepUp.start({
        action: 'change_email',
        payload: { new_email: newEmail.trim().toLowerCase() },
      });
      haptics.select();
    } catch (e: any) {
      haptics.error();
      toast.error(e?.message ?? 'Could not start verification.');
    }
  };

  const submitCode = async (value: string) => {
    if (value.length !== 6) return;
    try {
      await stepUp.verify(value);
      setCode('');
      haptics.success();
    } catch (e: any) {
      setCode('');
      haptics.error();
      toast.error(e?.message ?? 'Wrong code.');
    }
  };

  const resend = async () => {
    try {
      await stepUp.resend();
      toast.success('We sent you a new code.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not resend.');
    }
  };

  useEffect(() => {
    if (stepUp.status === 'completed') {
      const updatedUser = stepUp.challenge?.result?.user;
      if (updatedUser) setUser(updatedUser);
      toast.success('Email updated');
      router.back();
    }
  }, [stepUp.status, stepUp.challenge, setUser]);

  const nextFactor = stepUp.challenge?.factors.find(
    (f) => f.id === stepUp.challenge?.next_factor_id,
  );
  const factorsTotal = stepUp.challenge?.factors.length ?? 0;
  const factorIndex = nextFactor ? nextFactor.position + 1 : 0;

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
            <Button
              size="lg"
              className="w-full"
              disabled={stepUp.status === 'creating'}
              onPress={start}>
              {stepUp.status === 'creating' ? (
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
              disabled={stepUp.status === 'verifying'}>
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
