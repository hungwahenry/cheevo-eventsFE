import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Field } from '@/features/onboarding/components/field';
import { InterestGrid } from '@/features/onboarding/components/interest-grid';
import { OnboardingLayout } from '@/features/onboarding/components/onboarding-layout';
import { OptInRow } from '@/features/onboarding/components/opt-in-row';
import { useInterestsStep } from '@/features/onboarding/hooks';
import { Sparkles } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

export function InterestsStep() {
  const {
    interests,
    isLoading,
    selectedIds,
    toggleInterest,
    marketingOptIn,
    setMarketingOptIn,
    error,
    canFinish,
    onFinish,
    onBack,
    isSubmitting,
  } = useInterestsStep();

  return (
    <OnboardingLayout
      icon={Sparkles}
      title="What are you into?"
      subtitle="Pick a few — we'll tailor your feed."
      onBack={onBack}
      footer={
        <View className="gap-4">
          <OptInRow
            checked={marketingOptIn}
            onChange={setMarketingOptIn}
            label="Send me event recommendations and updates."
          />
          <Button
            size="lg"
            className="w-full"
            disabled={!canFinish || isSubmitting}
            onPress={onFinish}>
            {isSubmitting ? (
              <ActivityIndicator colorClassName="accent-primary-foreground" />
            ) : (
              <Text>Finish</Text>
            )}
          </Button>
        </View>
      }>
      <Field error={error ?? undefined}>
        <InterestGrid
          interests={interests}
          selectedIds={selectedIds}
          onToggle={toggleInterest}
          isLoading={isLoading}
        />
      </Field>
    </OnboardingLayout>
  );
}
