import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useOrganisationSubscribers } from '@/features/organisations/hooks';
import { useOpenUserProfile } from '@/features/users/hooks';
import { Image } from 'expo-image';
import { UserRoundIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  slug: string;
};

export function OrgSubscribersPreview({ slug }: Props) {
  const { data, isLoading } = useOrganisationSubscribers(slug);
  const openUser = useOpenUserProfile();

  if (isLoading) {
    return (
      <View className="flex-row items-center gap-3 px-5 py-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </View>
    );
  }

  if (!data || data.count === 0) return null;

  return (
    <View className="flex-row items-center gap-3 px-5 py-2">
      <View className="flex-row">
        {data.sample.slice(0, 5).map((user, i) => (
          <Pressable
            key={user.id}
            onPress={() => openUser(user.id)}
            style={{ marginLeft: i === 0 ? 0 : -8 }}>
            <View className="bg-muted border-background size-7 items-center justify-center overflow-hidden rounded-full border-2">
              {user.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <Icon
                  as={UserRoundIcon}
                  className="text-muted-foreground"
                  size={12}
                  strokeWidth={2}
                />
              )}
            </View>
          </Pressable>
        ))}
      </View>
      <Text className="text-muted-foreground text-xs">
        {data.count.toLocaleString()} follower{data.count === 1 ? '' : 's'}
      </Text>
    </View>
  );
}
