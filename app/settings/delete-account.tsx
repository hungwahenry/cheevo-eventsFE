import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useDeleteAccount } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { router } from 'expo-router';
import { ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

const REMOVED = [
  'Your profile, username, bio and photo',
  'RSVPs, orders and tickets you hold',
  'Comments, replies and reactions',
  'Followed organisations and notification settings',
  'Blocks you have set',
];

export default function DeleteAccountScreen() {
  const {
    stage,
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
  } = useDeleteAccount();

  return (
    <SettingsSubscreen title="Delete account">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 20 }}
        keyboardShouldPersistTaps="handled">
        {stage === 'confirm' ? (
          <View className="gap-5">
            <View className="bg-destructive/5 items-center gap-3 rounded-2xl p-6">
              <View className="bg-destructive/10 size-12 items-center justify-center rounded-full">
                <Icon as={TriangleAlert} className="text-destructive size-6" strokeWidth={2} />
              </View>
              <Text className="text-foreground text-center text-lg font-semibold">
                Delete your account
              </Text>
              <Text className="text-muted-foreground text-center text-sm">
                This is permanent. Once your account is gone we can&apos;t get it back, and your
                username won&apos;t be reserved.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                What we&apos;ll remove
              </Text>
              <View className="bg-muted overflow-hidden rounded-2xl">
                {REMOVED.map((line, i) => (
                  <View
                    key={i}
                    className={`px-4 py-3 ${i < REMOVED.length - 1 ? 'border-border/60 border-b' : ''}`}>
                    <Text className="text-foreground text-sm">{line}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text className="text-muted-foreground text-center text-xs">
              You&apos;ll get a 6-digit code on your email to confirm.
            </Text>

            <View className="gap-2">
              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                disabled={isStarting}
                onPress={start}>
                {isStarting ? (
                  <Spinner size="sm" barClassName="bg-white" />
                ) : (
                  <Text>Continue to delete</Text>
                )}
              </Button>
              <Button variant="outline" size="lg" className="w-full" onPress={() => router.back()}>
                <Text>Keep my account</Text>
              </Button>
            </View>
          </View>
        ) : null}

        {stage === 'verify' && nextFactor ? (
          <View className="gap-5">
            {factorsTotal > 1 ? (
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
                <Text className="text-muted-foreground text-center text-xs font-semibold tracking-wide uppercase">
                  Step {factorIndex} of {factorsTotal}
                </Text>
              </View>
            ) : null}

            <View className="bg-muted/40 items-center gap-3 rounded-2xl p-6">
              <View className="bg-primary/10 size-12 items-center justify-center rounded-full">
                <Icon as={ShieldCheck} className="text-primary size-6" strokeWidth={2} />
              </View>
              <Text className="text-foreground text-center text-lg font-semibold">
                Confirm it&apos;s you
              </Text>
              <Text className="text-muted-foreground text-center text-sm">
                We sent a 6-digit code to{' '}
                <Text className="text-foreground font-medium">{nextFactor.target_masked}</Text>.
                Enter it to delete your account.
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
                <Text className="text-primary text-sm font-semibold">Resend code</Text>
              </Text>
            </Pressable>

            <Button variant="ghost" onPress={() => router.back()}>
              <Text>Cancel</Text>
            </Button>
          </View>
        ) : null}
      </ScrollView>
    </SettingsSubscreen>
  );
}
