import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { blockedOrganisationsKey, useToggleBlock } from '@/features/blocks/hooks';
import type { BlockedOrganisation } from '@/features/blocks/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Building2Icon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  organisation: BlockedOrganisation;
};

export function BlockedOrgRow({ organisation }: Props) {
  const toggle = useToggleBlock();

  return (
    <View className="flex-row items-center gap-3 px-5 py-3">
      <Pressable
        onPress={() => router.push(`/org/${organisation.slug}` as any)}
        className="flex-row items-center gap-3 flex-1">
        <View className="bg-muted size-12 items-center justify-center overflow-hidden rounded-full">
          {organisation.logo_url ? (
            <Image
              source={{ uri: organisation.logo_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Icon
              as={Building2Icon}
              className="text-muted-foreground"
              size={20}
              strokeWidth={2}
            />
          )}
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
            {organisation.name}
          </Text>
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            @{organisation.slug}
          </Text>
        </View>
      </Pressable>
      <Button
        size="sm"
        variant="outline"
        disabled={toggle.isPending}
        onPress={() =>
          toggle.mutate({
            targetType: 'organisation',
            targetId: organisation.id,
            currentlyBlocked: true,
            invalidate: [blockedOrganisationsKey, ['org', organisation.slug]],
          })
        }>
        <Text>Unblock</Text>
      </Button>
    </View>
  );
}
