import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconInput } from '@/components/ui/icon-input';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useChangeEmail } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react-native';
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
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 20 }}
        keyboardShouldPersistTaps="handled">
        {stage === 'collect' ? (
          <View className="gap-5">
            <View className="bg-muted/40 items-center gap-3 rounded-2xl p-6">
              <View className="bg-primary/10 size-12 items-center justify-center rounded-full">
                <Icon as={Mail} className="text-primary size-6" strokeWidth={2} />
              </View>
              <Text className="text-foreground text-center text-lg font-sans-semibold">
                Update your email
              </Text>
              <Text className="text-muted-foreground text-center text-sm">
                We&apos;ll send a code to your current email, then to your new one. Both must check
                out before we make the switch.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold tracking-wide uppercase">
                Current
              </Text>
              <View className="bg-muted rounded-2xl px-4 py-3">
                <Text className="text-foreground text-sm" numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold tracking-wide uppercase">
                New
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
            </View>

            <Button size="lg" className="w-full" disabled={isStarting} onPress={start}>
              {isStarting ? (
                <Spinner size="sm" barClassName="bg-primary-foreground" />
              ) : (
                <>
                  <Text>Continue</Text>
                  <Icon as={ArrowRight} className="text-primary-foreground ml-1 size-5" />
                </>
              )}
            </Button>
          </View>
        ) : null}

        {stage === 'verify' && nextFactor ? (
          <View className="gap-5">
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                {Array.from({ length: factorsTotal }).map((_, i) => {
                  const isActive = i + 1 === factorIndex;
                  const isDone = i + 1 < factorIndex;
                  return (
                    <View
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        isActive ? 'bg-primary' : isDone ? 'bg-primary/60' : 'bg-muted'
                      }`}
                    />
                  );
                })}
              </View>
              <Text className="text-muted-foreground text-center text-xs font-sans-semibold tracking-wide uppercase">
                Step {factorIndex} of {factorsTotal}
              </Text>
            </View>

            <View className="bg-muted/40 items-center gap-3 rounded-2xl p-6">
              <View className="bg-primary/10 size-12 items-center justify-center rounded-full">
                <Icon as={ShieldCheck} className="text-primary size-6" strokeWidth={2} />
              </View>
              <Text className="text-foreground text-center text-lg font-sans-semibold">
                Enter your code
              </Text>
              <Text className="text-muted-foreground text-center text-sm">
                We sent a 6-digit code to{' '}
                <Text className="text-foreground font-sans-medium">{nextFactor.target_masked}</Text>.
              </Text>
            </View>

            <OtpInput value={code} onChangeText={setCode} onComplete={submitCode} autoFocus />

            <Pressable
              onPress={resend}
              hitSlop={8}
              className="self-center py-1"
              disabled={isVerifying}>
              <Text className="text-muted-foreground text-sm">
                Didn&apos;t get it?{' '}
                <Text className="text-primary text-sm font-sans-semibold">Resend code</Text>
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SettingsSubscreen>
  );
}
