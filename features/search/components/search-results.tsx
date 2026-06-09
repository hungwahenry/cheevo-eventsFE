import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { SearchEventRow } from '@/features/search/components/search-event-row';
import { SearchOrganisationRow } from '@/features/search/components/search-organisation-row';
import { SearchSection } from '@/features/search/components/search-section';
import { SearchUserRow } from '@/features/search/components/search-user-row';
import type { SearchGroups, SearchType } from '@/features/search/types';
import { useOpenUserProfile } from '@/features/users/hooks';
import { router } from 'expo-router';
import { SearchIcon, SearchXIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

type Props = {
  query: string;
  data: SearchGroups | undefined;
  isLoading: boolean;
  isError: boolean;
};

const SECTION_SIZE = 5;

export function SearchResults({ query, data, isLoading, isError }: Props) {
  const openUser = useOpenUserProfile();

  if (query.length < 2) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="Start typing"
        description="Search for events, organisers, and people on cheevo."
      />
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="Couldn't search"
        description="Check your connection and try again."
      />
    );
  }

  if (!data) return null;

  const total = data.events.length + data.organisations.length + data.users.length;

  if (total === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="No matches"
        description={`Nothing found for "${query}".`}
      />
    );
  }

  const handleSeeAll = (type: SearchType) =>
    router.push({ pathname: '/search/[type]', params: { type, q: query } } as any);

  const handleOpenEvent = (slug: string) => router.push(`/events/${slug}` as any);
  const handleOpenOrg = (slug: string) => router.push(`/org/${slug}` as any);
  const handleOpenUser = openUser;

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 64 }}>
      {data.events.length > 0 ? (
        <SearchSection
          title="Events"
          hasMore={data.events.length >= SECTION_SIZE}
          onSeeAll={() => handleSeeAll('event')}>
          {data.events.map((event) => (
            <SearchEventRow key={event.id} event={event} onPress={() => handleOpenEvent(event.slug)} />
          ))}
        </SearchSection>
      ) : null}

      {data.organisations.length > 0 ? (
        <SearchSection
          title="Organisations"
          hasMore={data.organisations.length >= SECTION_SIZE}
          onSeeAll={() => handleSeeAll('organisation')}>
          {data.organisations.map((org) => (
            <SearchOrganisationRow
              key={org.id}
              organisation={org}
              onPress={() => handleOpenOrg(org.slug)}
            />
          ))}
        </SearchSection>
      ) : null}

      {data.users.length > 0 ? (
        <SearchSection
          title="People"
          hasMore={data.users.length >= SECTION_SIZE}
          onSeeAll={() => handleSeeAll('user')}>
          {data.users.map((user) => (
            <SearchUserRow key={user.id} user={user} onPress={() => handleOpenUser(user.id)} />
          ))}
        </SearchSection>
      ) : null}

      <Text className="text-muted-foreground px-5 pt-6 text-center text-xs">
        Showing top results
      </Text>
    </ScrollView>
  );
}
