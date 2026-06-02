import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSubscribeToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { router } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function EventDetailOrganisation({ event }: { event: EventDetail }) {
  const org = event.organisation;
  const toggle = useSubscribeToggle(event.id, org.id);
  const openOrg = () => router.push(`/org/${org.slug}` as any);

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        onPress={openOrg}
        hitSlop={8}
        className="flex-1 flex-row items-center gap-3 active:opacity-70">
        {org.logo_url ? (
          <Avatar alt={`${org.name} logo`} className="size-10">
            <AvatarImage source={{ uri: org.logo_url }} />
          </Avatar>
        ) : null}

        <View className="flex-1">
          <Text className="text-foreground text-sm font-semibold">{org.name}</Text>
          <Text className="text-muted-foreground text-xs">
            {org.subscribers_count.toLocaleString()} followers
          </Text>
        </View>
      </Pressable>

      <Button
        size="sm"
        variant={event.is_subscribed ? 'outline' : 'default'}
        disabled={toggle.isPending}
        onPress={() => toggle.mutate(!event.is_subscribed)}>
        <Icon
          as={event.is_subscribed ? Check : Plus}
          className={
            event.is_subscribed ? 'text-foreground size-4' : 'text-primary-foreground size-4'
          }
          strokeWidth={2.25}
        />
        <Text>{event.is_subscribed ? 'Following' : 'Follow'}</Text>
      </Button>
    </View>
  );
}
