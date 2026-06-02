import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { blockedUsersKey, useToggleBlock } from '@/features/blocks/hooks';
import type { BlockedUser } from '@/features/blocks/types';
import { useOpenUserProfile } from '@/features/users/hooks';
import { Image } from 'expo-image';
import { UserRoundIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  user: BlockedUser;
};

export function BlockedUserRow({ user }: Props) {
  const toggle = useToggleBlock();
  const openUser = useOpenUserProfile();
  const displayName = user.display_name ?? user.username ?? 'Cheevo user';

  return (
    <View className="flex-row items-center gap-3 px-5 py-3">
      <Pressable onPress={() => openUser(user.id)} className="flex-row items-center gap-3 flex-1">
        <View className="bg-muted size-12 items-center justify-center overflow-hidden rounded-full">
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
              size={20}
              strokeWidth={2}
            />
          )}
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
            {displayName}
          </Text>
          {user.username ? (
            <Text numberOfLines={1} className="text-muted-foreground text-xs">
              @{user.username}
            </Text>
          ) : null}
        </View>
      </Pressable>
      <Button
        size="sm"
        variant="outline"
        disabled={toggle.isPending}
        onPress={() =>
          toggle.mutate({
            targetType: 'user',
            targetId: user.id,
            currentlyBlocked: true,
            invalidate: [blockedUsersKey, ['user', user.id]],
          })
        }>
        <Text>Unblock</Text>
      </Button>
    </View>
  );
}
