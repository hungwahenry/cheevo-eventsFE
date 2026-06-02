import { ActionsSheet } from '@/components/ui/actions-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { OrgHeader } from '@/features/organisations/components/org-header';
import { OrgPinnedHeader } from '@/features/organisations/components/org-pinned-header';
import { OrgTabs } from '@/features/organisations/components/org-tabs';
import {
  useOrganisationActions,
  useOrgScroll,
  usePublicOrganisation,
} from '@/features/organisations/hooks';
import { ReportSheet } from '@/features/reports';
import { useManualRefresh } from '@/lib/use-manual-refresh';
import { router, useLocalSearchParams } from 'expo-router';
import { Building2Icon, ChevronLeftIcon, MoreHorizontalIcon } from 'lucide-react-native';
import { Pressable, RefreshControl, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function OrgScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: org, isLoading, isError, refetch } = usePublicOrganisation(slug);
  const { refreshing, onRefresh } = useManualRefresh(refetch);
  const { scrollY, onScroll, pinStart, pinEnd } = useOrgScroll();
  const { actionsRef, reportRef, actions, pendingBlock, cancelBlock, confirmBlock } =
    useOrganisationActions(org ?? null);

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
            contentContainerStyle={{ paddingBottom: 96 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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

          <View className="pt-safe-offset-2 absolute top-0 right-3 z-30">
            <Pressable
              onPress={() => actionsRef.current?.present()}
              hitSlop={10}
              accessibilityLabel="More options"
              className="bg-foreground/15 size-9 items-center justify-center rounded-full">
              <Icon
                as={MoreHorizontalIcon}
                className="text-foreground"
                size={20}
                strokeWidth={2.25}
              />
            </Pressable>
          </View>

          <ActionsSheet ref={actionsRef} actions={actions} />
          <ReportSheet ref={reportRef} />

          <AlertDialog
            open={pendingBlock !== null}
            onOpenChange={(open) => !open && cancelBlock()}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Block @{pendingBlock?.slug}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Their events disappear from your feed and search, and they can't notify you.
                  You can unblock anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction onPress={confirmBlock}>
                  <Text>Block</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </View>
  );
}
