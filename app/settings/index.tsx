import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth';
import { SettingsRow, SettingsSection } from '@/features/settings';
import { useHapticsEnabled, useSetHapticsEnabled } from '@/lib/preferences';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  BellIcon,
  ChevronLeftIcon,
  FileTextIcon,
  HelpCircleIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MailIcon,
  ScrollTextIcon,
  SparklesIcon,
  UserCogIcon,
  UserXIcon,
  Vibrate,
} from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

const APP_VERSION = Constants.expoConfig?.version ?? '0.0.0';

export default function SettingsScreen() {
  const { signOut } = useSignOut();
  const hapticsEnabled = useHapticsEnabled();
  const setHapticsEnabled = useSetHapticsEnabled();

  const comingSoon = () => toast('Coming soon');

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="flex-row items-center gap-1 px-3 pb-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          className="size-10 items-center justify-center">
          <Icon as={ChevronLeftIcon} className="text-foreground size-6" strokeWidth={2.25} />
        </Pressable>
        <Text className="text-foreground text-2xl font-bold tracking-tight">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
        <SettingsSection title="General">
          <SettingsRow
            icon={UserCogIcon}
            label="Edit profile"
            onPress={() => router.push('/settings/edit-profile' as any)}
          />
          <SettingsRow
            icon={BellIcon}
            label="Notifications"
            onPress={() => router.push('/settings/notifications' as any)}
          />
          <SettingsRow
            icon={SparklesIcon}
            label="Interests"
            onPress={() => router.push('/settings/interests' as any)}
          />
        </SettingsSection>

        <SettingsSection title="Privacy & safety">
          <SettingsRow
            icon={UserXIcon}
            label="Blocked"
            subtitle="People and organisers you've blocked"
            onPress={() => router.push('/settings/privacy' as any)}
          />
        </SettingsSection>

        <SettingsSection title="App">
          <SettingsRow
            icon={Vibrate}
            label="Haptics"
            right={<Switch checked={hapticsEnabled} onCheckedChange={setHapticsEnabled} />}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow icon={MailIcon} label="Change email" onPress={comingSoon} />
          <SettingsRow icon={LogOutIcon} label="Log out" onPress={signOut} destructive />
          <SettingsRow
            icon={UserXIcon}
            label="Delete account"
            onPress={comingSoon}
            destructive
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon={LifeBuoyIcon} label="Help" onPress={comingSoon} />
          <SettingsRow icon={ScrollTextIcon} label="Terms" onPress={comingSoon} />
          <SettingsRow icon={FileTextIcon} label="Privacy policy" onPress={comingSoon} />
          <SettingsRow icon={HelpCircleIcon} label="About cheevo" subtitle={`v${APP_VERSION}`} />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
