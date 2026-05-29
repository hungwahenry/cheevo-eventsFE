import { verifyOtpSchema, type VerifyOtpInput } from '@/features/auth/validation';
import { isApiError } from '@/lib/api';
import { haptics } from '@/lib/haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { useSendOtp, useVerifyOtp } from './use-auth-mutations';

export function useVerifyForm(email: string) {
  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    mode: 'onTouched',
    defaultValues: { email, code: '' },
  });
  const verifyOtp = useVerifyOtp();
  const resendOtp = useSendOtp();
  const canSubmit = verifyOtpSchema.safeParse(form.watch()).success;

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
    canSubmit,
    submit,
    resend,
    isVerifying: verifyOtp.isPending,
    isResending: resendOtp.isPending,
  };
}
