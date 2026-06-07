import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { ProfileViewpoint } from '@/features/users/components/profile-tabs';
import { useUserOrganisations } from '@/features/users/hooks';
import type { UserOrganisation } from '@/features/users/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Building2Icon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  userId: string;
  viewpoint: ProfileViewpoint;
};

export function ProfileOrganisations({ userId, viewpoint }: Props) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserOrganisations(userId);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="gap-3 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Building2Icon}
        title="Not following anyone"
        description={
          viewpoint === 'self'
            ? 'Organisations you follow will show up here.'
            : 'Organisations they follow will show up here.'
        }
        className="py-8"
      />
    );
  }

  return (
    <View className="gap-3 py-2">
      {items.map((org) => (
        <OrgRow
          key={org.id}
          org={org}
          onPress={() => router.push(`/org/${org.slug}` as any)}
        />
      ))}
      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="items-center pt-2">
          <Text className="text-primary text-xs font-sans-semibold">
            {isFetchingNextPage ? 'Loading…' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function OrgRow({ org, onPress }: { org: UserOrganisation; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-xl">
      <View className="bg-muted size-11 items-center justify-center overflow-hidden rounded-full">
        {org.logo_url ? (
          <Image
            source={{ uri: org.logo_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <Icon as={Building2Icon} className="text-muted-foreground" size={18} strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-foreground text-sm font-sans-semibold">
          {org.name}
        </Text>
        <Text numberOfLines={1} className="text-muted-foreground text-xs">
          @{org.slug}
          {org.city ? ` · ${org.city}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}
