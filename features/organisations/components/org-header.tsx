import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { OrgFollowButton } from '@/features/organisations/components/org-follow-button';
import type { PublicOrganisation } from '@/features/organisations/types';
import { Image } from 'expo-image';
import { Building2Icon, MapPinIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  organisation: PublicOrganisation;
};

export function OrgHeader({ organisation }: Props) {
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

      <View className="flex-row items-end justify-between gap-3 px-5 -mt-8">
        <View className="bg-background size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background">
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

      <View className="gap-1 px-5">
        <Text className="text-foreground text-xl font-bold tracking-tight">
          {organisation.name}
        </Text>
        <Text className="text-muted-foreground text-sm">@{organisation.slug}</Text>
        {organisation.city ? (
          <View className="mt-1 flex-row items-center gap-1">
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
