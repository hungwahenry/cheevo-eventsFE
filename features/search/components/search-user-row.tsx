import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { SearchUserResult } from '@/features/search/types';
import { Image } from 'expo-image';
import { UserRoundIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  user: SearchUserResult;
  onPress: () => void;
};

export function SearchUserRow({ user, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-5 py-3">
      <View className="bg-muted size-14 items-center justify-center overflow-hidden rounded-full">
        {user.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <Icon as={UserRoundIcon} className="text-muted-foreground" size={20} strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-foreground text-sm font-sans-semibold">
          {user.display_name ?? user.username ?? 'Cheevo user'}
        </Text>
        {user.username ? (
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            @{user.username}
            {user.city ? ` · ${user.city}` : ''}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
