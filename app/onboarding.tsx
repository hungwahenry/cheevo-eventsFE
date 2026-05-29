import {
  AboutStep,
  InterestsStep,
  LocationStep,
  ProfileStep,
  useOnboardingStore,
} from '@/features/onboarding';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const step = useOnboardingStore((state) => state.step);
  const setStep = useOnboardingStore((state) => state.setStep);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        setStep(step - 1);
      }
      // Onboarding is required — never let hardware-back exit the flow.
      return true;
    });
    return () => subscription.remove();
  }, [step, setStep]);

  function renderStep() {
    switch (step) {
      case 0:
        return <ProfileStep />;
      case 1:
        return <AboutStep />;
      case 2:
        return <LocationStep />;
      default:
        return <InterestsStep />;
    }
  }

  return (
    <Animated.View key={step} entering={SlideInRight.duration(220)} style={{ flex: 1 }}>
      {renderStep()}
    </Animated.View>
  );
}
