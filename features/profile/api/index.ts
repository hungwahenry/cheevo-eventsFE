import type { Interest, User } from '@/features/auth';
import type { UpdateInterestsInput, UpdateProfileInput } from '@/features/profile/types';
import { api } from '@/lib/api';

export function updateProfile(input: UpdateProfileInput): Promise<User> {
  const form = new FormData();

  if (input.firstName !== undefined) form.append('first_name', input.firstName);
  if (input.lastName !== undefined) form.append('last_name', input.lastName);
  if (input.username !== undefined) form.append('username', input.username);
  if (input.bio !== undefined) form.append('bio', input.bio ?? '');
  if (input.latitude !== undefined) form.append('latitude', String(input.latitude));
  if (input.longitude !== undefined) form.append('longitude', String(input.longitude));
  if (input.placeName !== undefined) form.append('place_name', input.placeName);
  if (input.city !== undefined) form.append('city', input.city ?? '');
  if (input.removeAvatar) form.append('remove_avatar', '1');

  if (input.avatarUri) {
    const name = input.avatarUri.split('/').pop() ?? 'avatar.jpg';
    const ext = (name.split('.').pop() ?? 'jpg').toLowerCase();
    form.append('avatar', {
      uri: input.avatarUri,
      name,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as unknown as Blob);
  }

  form.append('_method', 'PATCH');

  return api.post<User>('/attendee/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function updateInterests(input: UpdateInterestsInput): Promise<Interest[]> {
  return api.patch<Interest[]>('/attendee/interests', { interests: input.interestIds });
}
