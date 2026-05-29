import type { Gender } from '@/features/auth';

export type OnboardingDraft = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUri: string | null;
  dateOfBirth: string | null; // YYYY-MM-DD
  gender: Gender | null;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
  city: string | null;
  interestIds: number[];
  marketingOptIn: boolean;
};

export type UsernameAvailability = {
  username: string;
  available: boolean;
};
