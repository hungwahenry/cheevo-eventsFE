import * as authApi from '@/features/auth/api';
import { useSessionStore } from '@/features/auth/stores';
import type { SendOtpInput, VerifyOtpInput } from '@/features/auth/validation';
import { useMutation } from '@tanstack/react-query';

export function useSendOtp() {
  return useMutation({
    mutationFn: (input: SendOtpInput) => authApi.sendOtp(input.email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (input: VerifyOtpInput) => authApi.verifyOtp(input),
    onSuccess: (result) => useSessionStore.getState().setSession(result.token, result.user),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => useSessionStore.getState().signOut(),
  });
}
