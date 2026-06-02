import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { OrgFollowButton } from '@/features/organisations/components/org-follow-button';
import { OrgHeader } from '@/features/organisations/components/org-header';
import { OrgSubscribersPreview } from '@/features/organisations/components/org-subscribers-preview';
import { OrgTabs } from '@/features/organisations/components/org-tabs';
import { usePublicOrganisation } from '@/features/organisations/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { Building2Icon, ChevronLeftIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

const STICKY_THRESHOLD = 160;

export default function OrgScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: org, isLoading, isError } = usePublicOrganisation(slug);
  const [scrollY, setScrollY] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
  };

  return (
    <View className="bg-background flex-1">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      ) : isError || !org ? (
        <EmptyState
          icon={Building2Icon}
          title="Organisation not found"
          description="It might have been removed or you opened a stale link."
        />
      ) : (
        <>
          <ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 96 }}>
            <OrgHeader organisation={org} />
            <OrgSubscribersPreview slug={org.slug} />
            <View className="h-4" />
            <OrgTabs organisation={org} />
          </ScrollView>

          {scrollY > STICKY_THRESHOLD ? (
            <View className="pt-safe-offset-2 bg-background border-border absolute inset-x-0 top-0 z-20 flex-row items-center justify-between border-b px-3 pb-2">
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                accessibilityLabel="Back"
                className="size-9 items-center justify-center">
                <Icon
                  as={ChevronLeftIcon}
                  className="text-foreground"
                  size={22}
                  strokeWidth={2.25}
                />
              </Pressable>
              <Text numberOfLines={1} className="text-foreground flex-1 px-2 text-base font-semibold">
                {org.name}
              </Text>
              <OrgFollowButton organisation={org} size="sm" />
            </View>
          ) : null}

          <View className="pt-safe-offset-2 absolute top-0 left-3 z-10">
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              accessibilityLabel="Back"
              className="bg-foreground/15 size-9 items-center justify-center rounded-full">
              <Icon
                as={ChevronLeftIcon}
                className="text-foreground"
                size={20}
                strokeWidth={2.25}
              />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
