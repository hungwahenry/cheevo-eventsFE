import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useUserOrganisations } from '@/features/users/hooks';
import type { UserOrganisation } from '@/features/users/types';
import { Image } from 'expo-image';
import { Building2Icon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  userId: string;
  onOpen?: (org: UserOrganisation) => void;
};

export function ProfileOrganisations({ userId, onOpen }: Props) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserOrganisations(userId);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="gap-3 px-5 py-4">
        <SectionTitle>Following</SectionTitle>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View className="gap-2 px-5 py-4">
      <SectionTitle>Following</SectionTitle>
      <View className="gap-2">
        {items.map((org) => (
          <OrgRow key={org.id} org={org} onPress={onOpen ? () => onOpen(org) : undefined} />
        ))}
      </View>
      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="items-center pt-2">
          <Text className="text-primary text-xs font-semibold">
            {isFetchingNextPage ? 'Loading…' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function OrgRow({ org, onPress }: { org: UserOrganisation; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 rounded-xl">
      <View className="bg-muted size-11 items-center justify-center overflow-hidden rounded-full">
        {org.logo_url ? (
          <Image
            source={{ uri: org.logo_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <Building2Icon size={18} className="text-muted-foreground" strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
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

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
      {children}
    </Text>
  );
}
