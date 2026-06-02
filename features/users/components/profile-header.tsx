import { Text } from '@/components/ui/text';
import type { PublicUser } from '@/features/users/types';
import { Image } from 'expo-image';
import { MapPinIcon, UserRoundIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  user: PublicUser;
};

export function ProfileHeader({ user }: Props) {
  const name = user.display_name ?? user.username ?? 'Cheevo user';

  return (
    <View className="items-center gap-3 px-5 pt-2 pb-6">
      <View className="bg-muted size-24 items-center justify-center overflow-hidden rounded-full">
        {user.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <UserRoundIcon size={36} className="text-muted-foreground" strokeWidth={2} />
        )}
      </View>

      <View className="items-center gap-1">
        <Text className="text-foreground text-xl font-bold tracking-tight">{name}</Text>
        {user.username ? (
          <Text className="text-muted-foreground text-sm">@{user.username}</Text>
        ) : null}
      </View>

      {user.bio ? (
        <Text className="text-foreground max-w-xs text-center text-sm">{user.bio}</Text>
      ) : null}

      {user.city ? (
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={14} className="text-muted-foreground" strokeWidth={2} />
          <Text className="text-muted-foreground text-xs">{user.city}</Text>
        </View>
      ) : null}
    </View>
  );
}
