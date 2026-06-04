import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth';
import { SettingsRow, SettingsSection } from '@/features/settings';
import { openLegalPage } from '@/lib/legal';
import { useHapticsEnabled, useSetHapticsEnabled } from '@/lib/preferences';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  BellIcon,
  ChevronLeftIcon,
  DownloadIcon,
  FileTextIcon,
  HelpCircleIcon,
  LogOutIcon,
  MailIcon,
  ScrollTextIcon,
  SparklesIcon,
  UserCogIcon,
  UserXIcon,
  Vibrate,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const APP_VERSION = Constants.expoConfig?.version ?? '0.0.0';

export default function SettingsScreen() {
  const { signOut } = useSignOut();
  const hapticsEnabled = useHapticsEnabled();
  const setHapticsEnabled = useSetHapticsEnabled();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          <SettingsRow
            icon={MailIcon}
            label="Change email"
            onPress={() => router.push('/settings/change-email' as any)}
          />
          <SettingsRow
            icon={DownloadIcon}
            label="Export my data"
            onPress={() => router.push('/settings/data-export' as any)}
          />
          <SettingsRow icon={LogOutIcon} label="Log out" onPress={signOut} destructive />
          <SettingsRow
            icon={UserXIcon}
            label="Delete account"
            onPress={() => setShowDeleteConfirm(true)}
            destructive
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow
            icon={ScrollTextIcon}
            label="Terms"
            onPress={() => openLegalPage('terms')}
          />
          <SettingsRow
            icon={FileTextIcon}
            label="Privacy policy"
            onPress={() => openLegalPage('privacy')}
          />
          <SettingsRow
            icon={HelpCircleIcon}
            label="About cheevo"
            right={<Text className="text-muted-foreground text-sm">v{APP_VERSION}</Text>}
          />
        </SettingsSection>
      </ScrollView>

      <AlertDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent. We'll email a code to confirm. Past order receipts are kept for
              our records but no longer linked to you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={() => {
                setShowDeleteConfirm(false);
                router.push('/settings/delete-account' as any);
              }}>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
