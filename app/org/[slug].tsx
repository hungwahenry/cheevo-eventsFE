import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { OrgHeader } from '@/features/organisations/components/org-header';
import { OrgPinnedHeader } from '@/features/organisations/components/org-pinned-header';
import { OrgTabs } from '@/features/organisations/components/org-tabs';
import { useOrgScroll, usePublicOrganisation } from '@/features/organisations/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { Building2Icon, ChevronLeftIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function OrgScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: org, isLoading, isError } = usePublicOrganisation(slug);
  const { scrollY, onScroll, pinStart, pinEnd } = useOrgScroll();

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
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 96 }}>
            <OrgHeader organisation={org} />
            <View className="h-4" />
            <OrgTabs organisation={org} />
          </Animated.ScrollView>

          <OrgPinnedHeader
            organisation={org}
            scrollY={scrollY}
            startAt={pinStart}
            endAt={pinEnd}
          />

          <View className="pt-safe-offset-2 absolute top-0 left-3 z-30">
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
