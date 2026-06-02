import { Screen } from '@/components/screen';
import { Icon } from '@/components/ui/icon';
import { useCurrentUser, useSignOut } from '@/features/auth';
import { ProfileHeader } from '@/features/users/components/profile-header';
import { ProfileInterests } from '@/features/users/components/profile-interests';
import { ProfileTabs } from '@/features/users/components/profile-tabs';
import { LogOutIcon } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';

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
        <ProfileTabs userId={user.id} viewpoint="self" />
      </ScrollView>
    </Screen>
  );
}
