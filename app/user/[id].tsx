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
import { ReportSheet } from '@/features/reports';
import { ProfileHeader } from '@/features/users/components/profile-header';
import { ProfileInterests } from '@/features/users/components/profile-interests';
import { ProfileTabs } from '@/features/users/components/profile-tabs';
import { usePublicUser, useUserActions } from '@/features/users/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeftIcon, MoreHorizontalIcon, UserRoundXIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

export default function PublicUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isLoading, isError } = usePublicUser(id);
  const { actionsRef, reportRef, actions, pendingBlock, cancelBlock, confirmBlock } =
    useUserActions(user ?? null);

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="flex-row items-center justify-between px-3 pb-1">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          className="size-10 items-center justify-center">
          <Icon as={ChevronLeftIcon} className="text-foreground size-6" strokeWidth={2.25} />
        </Pressable>
        {user ? (
          <Pressable
            onPress={() => actionsRef.current?.present()}
            hitSlop={10}
            accessibilityLabel="More options"
            className="size-10 items-center justify-center">
            <Icon
              as={MoreHorizontalIcon}
              className="text-foreground size-6"
              strokeWidth={2.25}
            />
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      ) : isError || !user ? (
        <EmptyState
          icon={UserRoundXIcon}
          title="User not found"
          description="This profile is private or doesn't exist."
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
            <ProfileHeader user={user} />
            <ProfileInterests userId={user.id} />
            <ProfileTabs userId={user.id} viewpoint="other" />
          </ScrollView>

          <ActionsSheet ref={actionsRef} actions={actions} />
          <ReportSheet ref={reportRef} />

          <AlertDialog
            open={pendingBlock !== null}
            onOpenChange={(open) => !open && cancelBlock()}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Block {pendingBlock?.username ? `@${pendingBlock.username}` : 'this person'}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You won't see each other's comments and they won't be able to interact with you.
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
