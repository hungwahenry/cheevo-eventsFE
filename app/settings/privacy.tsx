import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { UnderlinedTabs, type UnderlinedTab } from '@/components/ui/underlined-tabs';
import { BlockedOrgRow } from '@/features/blocks/components/blocked-org-row';
import { BlockedUserRow } from '@/features/blocks/components/blocked-user-row';
import { useBlockedOrganisations, useBlockedUsers } from '@/features/blocks/hooks';
import { SettingsSubscreen } from '@/features/settings';
import { Building2Icon, UserRoundIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

type TabKey = 'people' | 'orgs';

const TABS: UnderlinedTab<TabKey>[] = [
  { value: 'people', label: 'People', icon: UserRoundIcon },
  { value: 'orgs', label: 'Organisers', icon: Building2Icon },
];

export default function PrivacySettingsScreen() {
  const [value, setValue] = useState<TabKey>('people');

  return (
    <SettingsSubscreen title="Blocked">
      <UnderlinedTabs tabs={TABS} value={value} onValueChange={setValue} />
      {value === 'people' ? <BlockedPeople /> : <BlockedOrgs />}
    </SettingsSubscreen>
  );
}

function BlockedPeople() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlockedUsers();
  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Spinner />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UserRoundIcon}
        title="No blocked people"
        description="People you block will show up here. Unblock them anytime."
        className="py-12"
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(u) => u.id}
      renderItem={({ item }) => <BlockedUserRow user={item} />}
      ItemSeparatorComponent={() => <View className="border-border h-px" />}
      onEndReachedThreshold={0.4}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-6">
            <Text className="text-muted-foreground text-xs">Loading more…</Text>
          </View>
        ) : null
      }
    />
  );
}

function BlockedOrgs() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBlockedOrganisations();
  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Spinner />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Building2Icon}
        title="No blocked organisers"
        description="Organisers you block will show up here. Unblock them anytime."
        className="py-12"
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(o) => o.id}
      renderItem={({ item }) => <BlockedOrgRow organisation={item} />}
      ItemSeparatorComponent={() => <View className="border-border h-px" />}
      onEndReachedThreshold={0.4}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-6">
            <Text className="text-muted-foreground text-xs">Loading more…</Text>
          </View>
        ) : null
      }
    />
  );
}
