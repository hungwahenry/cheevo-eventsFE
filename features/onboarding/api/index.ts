import type { Interest, User } from '@/features/auth';
import type { OnboardingDraft, UsernameAvailability } from '@/features/onboarding/types';
import { api } from '@/lib/api';

export function getInterests(): Promise<Interest[]> {
  return api.get<Interest[]>('/onboarding/interests');
}

export function checkUsername(username: string): Promise<UsernameAvailability> {
  return api.get<UsernameAvailability>('/onboarding/username-available', {
    params: { username },
  });
}

export function completeProfile(draft: OnboardingDraft): Promise<User> {
  const form = new FormData();

  form.append('first_name', draft.firstName);
  form.append('last_name', draft.lastName);
  form.append('username', draft.username);
  form.append('marketing_opt_in', draft.marketingOptIn ? '1' : '0');

  if (draft.gender) form.append('gender', draft.gender);
  if (draft.dateOfBirth) form.append('date_of_birth', draft.dateOfBirth);
  if (draft.latitude !== null) form.append('latitude', String(draft.latitude));
  if (draft.longitude !== null) form.append('longitude', String(draft.longitude));
  if (draft.placeName) form.append('place_name', draft.placeName);
  if (draft.city) form.append('city', draft.city);

  draft.interestIds.forEach((id) => form.append('interests[]', String(id)));

  if (draft.avatarUri) {
    const name = draft.avatarUri.split('/').pop() ?? 'avatar.jpg';
    const ext = (name.split('.').pop() ?? 'jpg').toLowerCase();
    form.append('avatar', {
      uri: draft.avatarUri,
      name,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as unknown as Blob);
  }

  return api.post<User>('/onboarding/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
