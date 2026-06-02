import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useDeleteAccount } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

export default function DeleteAccountScreen() {
  const { code, setCode, nextFactor, isPreparing, isVerifying, submitCode, resend } =
    useDeleteAccount();

  return (
    <SettingsSubscreen title="Delete account">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        {isPreparing || !nextFactor ? (
          <View className="items-center py-16">
            <Spinner size="lg" />
          </View>
        ) : (
          <View className="gap-4">
            <Text className="text-muted-foreground text-sm">
              This is permanent. Your profile, blocks, RSVPs, comments and notification settings
              will be removed. We sent a 6-digit code to{' '}
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
            <Button variant="outline" onPress={() => router.back()}>
              <Text>Cancel</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SettingsSubscreen>
  );
}
