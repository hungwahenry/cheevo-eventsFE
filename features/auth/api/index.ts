import { api } from '@/lib/api';
import type { User, VerifyOtpResult } from '@/features/auth/types';
import type { VerifyOtpInput } from '@/features/auth/validation';

export async function sendOtp(email: string): Promise<void> {
  await api.post<null>('/auth/send-otp', { email });
}

export function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResult> {
  return api.post<VerifyOtpResult>('/auth/verify-otp', input);
}

export function me(): Promise<User> {
  return api.get<User>('/auth/me');
}

export async function logout(): Promise<void> {
  await api.post<null>('/auth/logout');
}
