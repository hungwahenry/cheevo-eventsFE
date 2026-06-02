import { Icon } from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
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

export function OrgTabs({ organisation }: Props) {
  const [value, setValue] = useState<TabKey>('upcoming');
  const upcoming = useOrganisationUpcomingEvents(organisation.slug);
  const past = useOrganisationPastEvents(organisation.slug);

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as TabKey)} className="px-5">
      <TabsList className="h-10 w-full">
        <TabsTrigger value="upcoming" className="flex-1">
          <Icon as={CalendarIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>Upcoming</Text>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex-1">
          <Icon as={HistoryIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>Past</Text>
        </TabsTrigger>
        <TabsTrigger value="about" className="flex-1">
          <Icon as={InfoIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>About</Text>
        </TabsTrigger>
      </TabsList>

      <View className="-mx-5 pt-1">
        <TabsContent value="upcoming">
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
        </TabsContent>
        <TabsContent value="past">
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
        </TabsContent>
        <TabsContent value="about">
          <OrgAbout organisation={organisation} />
        </TabsContent>
      </View>
    </Tabs>
  );
}
