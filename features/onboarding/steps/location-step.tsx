import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LocationPrompt } from '@/features/onboarding/components/location-prompt';
import { OnboardingLayout } from '@/features/onboarding/components/onboarding-layout';
import { useLocationStep } from '@/features/onboarding/hooks';

export function LocationStep() {
  const { status, hasLocation, placeName, requestLocation, onContinue, onBack } = useLocationStep();

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      title="Where are you?"
      subtitle="We use your location to surface events happening near you."
      onBack={onBack}
      contentAlignment="fill"
      footer={
        <Button size="lg" className="w-full" disabled={!hasLocation} onPress={onContinue}>
          <Text>Continue</Text>
        </Button>
      }>
      <LocationPrompt
        status={status}
        hasLocation={hasLocation}
        placeName={placeName}
        onRequest={requestLocation}
      />
    </OnboardingLayout>
  );
}
