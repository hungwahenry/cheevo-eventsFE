import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { InterestGrid } from '@/features/onboarding/components/interest-grid';
import { useInterestsSettings } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { ScrollView } from 'react-native';

export default function InterestsSettingsScreen() {
  const { interests, isLoading, selectedIds, toggle, canSave, isSaving, save } =
    useInterestsSettings();

  return (
    <SettingsSubscreen
      title="Interests"
      rightAction={
        <Button
          size="sm"
          variant="ghost"
          disabled={!canSave || isSaving}
          onPress={save}>
          {isSaving ? (
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
