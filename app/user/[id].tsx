import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { ProfileHeader } from '@/features/users/components/profile-header';
import { ProfileInterests } from '@/features/users/components/profile-interests';
import { ProfileOrganisations } from '@/features/users/components/profile-organisations';
import { usePublicUser } from '@/features/users/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeftIcon, UserRoundXIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

export default function PublicUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isLoading, isError } = usePublicUser(id);

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="px-3 pb-1">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          className="size-10 items-center justify-center">
          <Icon as={ChevronLeftIcon} className="text-foreground size-6" strokeWidth={2.25} />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      ) : isError || !user ? (
        <EmptyState
          icon={UserRoundXIcon}
          title="User not found"
          description="This profile is private or doesn't exist."
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
          <ProfileHeader user={user} />
          <ProfileInterests userId={user.id} />
          <ProfileOrganisations userId={user.id} />
        </ScrollView>
      )}
    </View>
  );
}
