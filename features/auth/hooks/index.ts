import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';

import * as authApi from '@/features/auth/api';
import { useSessionStore } from '@/features/auth/stores';
import {
  sendOtpSchema,
  verifyOtpSchema,
  type SendOtpInput,
  type VerifyOtpInput,
} from '@/features/auth/validation';
import { isApiError, setUnauthorizedHandler } from '@/lib/api';
import { haptics } from '@/lib/haptics';

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

export function useAuthBootstrap() {
  useEffect(() => {
    setUnauthorizedHandler(() => useSessionStore.getState().forceUnauthenticated());
    void useSessionStore.getState().bootstrap();

    return () => setUnauthorizedHandler(null);
  }, []);
}

export function useEmailForm() {
  const form = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: '' },
  });
  const sendOtp = useSendOtp();

  const submit = form.handleSubmit((data) => {
    haptics.select();
    sendOtp.mutate(data, {
      onSuccess: () => {
        haptics.success();
        router.push({ pathname: '/verify', params: { email: data.email } });
      },
      onError: (error) => {
        haptics.error();
        if (isApiError(error) && error.isValidation && error.fieldErrors().email) {
          form.setError('email', { message: error.fieldErrors().email });
        }
      },
    });
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    submit,
    isPending: sendOtp.isPending,
  };
}

export function useVerifyForm(email: string) {
  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, code: '' },
  });
  const verifyOtp = useVerifyOtp();
  const resendOtp = useSendOtp();

  const submit = form.handleSubmit((data) => {
    haptics.select();
    verifyOtp.mutate(data, {
      onSuccess: () => {
        haptics.success();
        router.replace('/');
      },
      onError: (error) => {
        haptics.error();
        if (isApiError(error) && error.isValidation) {
          form.setError('code', { message: error.message });
        }
      },
    });
  });

  const resend = () => {
    if (!email) return;
    resendOtp.mutate({ email }, { onSuccess: () => toast.success('We sent you a new code.') });
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    submit,
    resend,
    isVerifying: verifyOtp.isPending,
    isResending: resendOtp.isPending,
  };
}

export function useSignOut() {
  const logout = useLogout();
  const signOut = () => logout.mutate(undefined, { onSuccess: () => router.replace('/') });

  return { signOut, isPending: logout.isPending };
}
