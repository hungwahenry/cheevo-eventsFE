import { UnderlinedTabs, type UnderlinedTab } from '@/components/ui/underlined-tabs';
import { OrgAbout } from '@/features/organisations/components/org-about';
import { OrgEventsList } from '@/features/organisations/components/org-events-list';
import {
  useOrganisationPastEvents,
  useOrganisationUpcomingEvents,
} from '@/features/organisations/hooks';
import type { PublicOrganisation } from '@/features/organisations/types';
import { CalendarIcon, HistoryIcon, InfoIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  organisation: PublicOrganisation;
};

type TabKey = 'upcoming' | 'past' | 'about';

const TABS: UnderlinedTab<TabKey>[] = [
  { value: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
  { value: 'past', label: 'Past', icon: HistoryIcon },
  { value: 'about', label: 'About', icon: InfoIcon },
];

export function OrgTabs({ organisation }: Props) {
  const [value, setValue] = useState<TabKey>('upcoming');
  const upcoming = useOrganisationUpcomingEvents(organisation.slug);
  const past = useOrganisationPastEvents(organisation.slug);

  return (
    <View>
      <UnderlinedTabs tabs={TABS} value={value} onValueChange={setValue} />

      <View className="pt-2">
        {value === 'upcoming' ? (
          <OrgEventsList
            data={upcoming.data}
            isLoading={upcoming.isLoading}
            hasNextPage={!!upcoming.hasNextPage}
            isFetchingNextPage={upcoming.isFetchingNextPage}
            fetchNextPage={upcoming.fetchNextPage}
            emptyTitle="No upcoming events"
            emptyDescription="When this organiser publishes a new event, it'll show up here."
            variant="upcoming"
          />
        ) : null}
        {value === 'past' ? (
          <OrgEventsList
            data={past.data}
            isLoading={past.isLoading}
            hasNextPage={!!past.hasNextPage}
            isFetchingNextPage={past.isFetchingNextPage}
            fetchNextPage={past.fetchNextPage}
            emptyTitle="No past events"
            emptyDescription="Events that have ended will appear here."
            variant="past"
          />
        ) : null}
        {value === 'about' ? <OrgAbout organisation={organisation} /> : null}
      </View>
    </View>
  );
}
