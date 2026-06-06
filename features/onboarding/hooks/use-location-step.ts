import { useOnboardingStore } from '@/features/onboarding/stores';
import { haptics } from '@/lib/haptics';
import { requestDeviceLocation } from '@/lib/location';
import { useState } from 'react';
import { toast } from 'sonner-native';

export function useLocationStep() {
  const latitude = useOnboardingStore((s) => s.latitude);
  const placeName = useOnboardingStore((s) => s.placeName);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const requestLocation = async () => {
    setStatus('loading');
    try {
      const result = await requestDeviceLocation();
      if (result.status === 'denied') {
        setStatus('idle');
        haptics.error();
        toast.error('Location permission is required. Enable it in Settings.');
        return;
      }
      if (result.status === 'unavailable') {
        setStatus('idle');
        haptics.error();
        toast.error("Couldn't get your location. Check that location services are on.");
        return;
      }
      patch(result.location);
      setStatus('idle');
      haptics.success();
    } catch {
      setStatus('idle');
      haptics.error();
    }
  };

  const onContinue = () => {
    if (latitude === null) return;
    haptics.select();
    setStep(3);
  };

  return {
    status,
    hasLocation: latitude !== null,
    placeName,
    requestLocation,
    onContinue,
    onBack: () => setStep(1),
  };
}
