import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCurrentUser, useSignOut } from '@/features/auth';
import { ProfileHeader } from '@/features/users/components/profile-header';
import { ProfileInterests } from '@/features/users/components/profile-interests';
import { ProfileOrganisations } from '@/features/users/components/profile-organisations';
import { LogOutIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

export default function ProfileScreen() {
  const user = useCurrentUser();
  const { signOut, isPending } = useSignOut();

  if (!user) return null;

  const publicShape = {
    id: user.id,
    username: user.profile.username,
    display_name:
      [user.profile.first_name, user.profile.last_name].filter(Boolean).join(' ') || null,
    avatar_url: user.profile.avatar_url || null,
    bio: user.profile.bio,
    city: user.profile.city,
  };

  return (
    <Screen
      title="Profile"
      rightAction={
        <Pressable
          onPress={signOut}
          disabled={isPending}
          hitSlop={10}
          accessibilityLabel="Log out"
          className="bg-muted size-10 items-center justify-center rounded-full">
          <Icon as={LogOutIcon} className="text-foreground size-5" strokeWidth={2.25} />
        </Pressable>
      }>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileHeader user={publicShape} />
        <ProfileInterests userId={user.id} />
        <ProfileOrganisations userId={user.id} />

        <View className="px-5 pt-6">
          <Button variant="outline" onPress={signOut} disabled={isPending}>
            <Text>Log out</Text>
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
