import { create } from 'zustand';

import type { OnboardingDraft } from '@/features/onboarding/types';

type OnboardingState = OnboardingDraft & {
  step: number;
  patch: (values: Partial<OnboardingDraft>) => void;
  toggleInterest: (id: number) => void;
  setStep: (step: number) => void;
  reset: () => void;
};

const initialDraft: OnboardingDraft = {
  firstName: '',
  lastName: '',
  username: '',
  avatarUri: null,
  dateOfBirth: null,
  gender: null,
  latitude: null,
  longitude: null,
  placeName: null,
  city: null,
  interestIds: [],
  marketingOptIn: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialDraft,
  step: 0,

  patch: (values) => set(values),

  toggleInterest: (id) =>
    set((state) => ({
      interestIds: state.interestIds.includes(id)
        ? state.interestIds.filter((existing) => existing !== id)
        : [...state.interestIds, id],
    })),

  setStep: (step) => set({ step }),

  reset: () => set({ ...initialDraft, step: 0 }),
}));
