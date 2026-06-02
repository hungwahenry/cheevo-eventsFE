import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/features/auth';
import { InterestGrid } from '@/features/onboarding/components/interest-grid';
import { useInterests } from '@/features/onboarding/hooks';
import { useUpdateInterests } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { toast } from 'sonner-native';

export default function InterestsSettingsScreen() {
  const user = useCurrentUser();
  const { data: interests = [], isLoading } = useInterests();
  const updateInterests = useUpdateInterests();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) setSelectedIds(user.interests.map((i) => i.id));
  }, [user]);

  const toggle = (id: number) => {
    haptics.select();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const initialIds = user?.interests.map((i) => i.id) ?? [];
  const dirty =
    selectedIds.length !== initialIds.length ||
    selectedIds.some((id) => !initialIds.includes(id));
  const canSave = dirty && selectedIds.length > 0;

  const save = () => {
    updateInterests.mutate(
      { interestIds: selectedIds },
      {
        onSuccess: () => {
          haptics.success();
          toast.success('Interests updated');
          router.back();
        },
        onError: () => {
          haptics.error();
          toast.error('Could not save. Try again.');
        },
      },
    );
  };

  return (
    <SettingsSubscreen
      title="Interests"
      rightAction={
        <Button
          size="sm"
          variant="ghost"
          disabled={!canSave || updateInterests.isPending}
          onPress={save}>
          {updateInterests.isPending ? (
            <Spinner size="sm" barClassName="bg-foreground" />
          ) : (
            <Text className="text-primary font-semibold">Save</Text>
          )}
        </Button>
      }>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
        <Text className="text-muted-foreground pb-4 text-sm">
          Pick what you're into — we'll tailor your feed.
        </Text>
        <InterestGrid
          interests={interests}
          selectedIds={selectedIds}
          onToggle={toggle}
          isLoading={isLoading}
        />
      </ScrollView>
    </SettingsSubscreen>
  );
}
