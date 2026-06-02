import { Text } from '@/components/ui/text';
import type { SearchOrganisationResult } from '@/features/search/types';
import { Image } from 'expo-image';
import { Building2Icon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  organisation: SearchOrganisationResult;
  onPress: () => void;
};

export function SearchOrganisationRow({ organisation, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-5 py-3">
      <View className="bg-muted size-14 items-center justify-center overflow-hidden rounded-full">
        {organisation.logo_url ? (
          <Image source={{ uri: organisation.logo_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <Building2Icon size={20} className="text-muted-foreground" strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
          {organisation.name}
        </Text>
        <Text numberOfLines={1} className="text-muted-foreground text-xs">
          @{organisation.slug}
          {organisation.city ? ` · ${organisation.city}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}
