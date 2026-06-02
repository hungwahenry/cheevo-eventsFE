import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { OrgFollowButton } from '@/features/organisations/components/org-follow-button';
import type { PublicOrganisation } from '@/features/organisations/types';
import { formatMonthYear } from '@/lib/format/datetime';
import { formatCompact } from '@/lib/format/number';
import { Image } from 'expo-image';
import { Building2Icon, MapPinIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  organisation: PublicOrganisation;
};

export function OrgHeader({ organisation }: Props) {
  const stats = [
    `${formatCompact(organisation.subscribers_count)} followers`,
    `${formatCompact(organisation.events_count)} events`,
    formatMonthYear(organisation.hosting_since)
      ? `Since ${formatMonthYear(organisation.hosting_since)}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="gap-3">
      <View className="bg-muted aspect-[3/1] w-full">
        {organisation.cover_url ? (
          <Image
            source={{ uri: organisation.cover_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : null}
      </View>

      <View className="-mt-8 flex-row items-end justify-between gap-3 px-5">
        <View className="border-background bg-background size-20 items-center justify-center overflow-hidden rounded-full border-4">
          <View className="bg-muted size-full items-center justify-center">
            {organisation.logo_url ? (
              <Image
                source={{ uri: organisation.logo_url }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <Icon as={Building2Icon} className="text-muted-foreground" size={28} strokeWidth={2} />
            )}
          </View>
        </View>
        <OrgFollowButton organisation={organisation} size="sm" />
      </View>

      <View className="gap-0.5 px-5">
        <Text className="text-foreground text-xl font-bold tracking-tight">
          {organisation.name}
        </Text>
        <Text className="text-muted-foreground text-sm">@{organisation.slug}</Text>
        <Text className="text-muted-foreground mt-1 text-xs">{stats}</Text>
        {organisation.city ? (
          <View className="mt-0.5 flex-row items-center gap-1">
            <Icon
              as={MapPinIcon}
              className="text-muted-foreground"
              size={14}
              strokeWidth={2}
            />
            <Text className="text-muted-foreground text-xs">{organisation.city}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
