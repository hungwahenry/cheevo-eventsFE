import { verifyOtpSchema, type VerifyOtpInput } from '@/features/auth/validation';
import { isApiError } from '@/lib/api';
import { firstErrorMessage } from '@/lib/form-errors';
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

  const submit = form.handleSubmit(
    (data) => {
      haptics.select();
      verifyOtp.mutate(data, {
        onSuccess: () => {
          haptics.success();
          router.replace('/');
        },
        onError: (error) => {
          haptics.error();
          if (isApiError(error)) {
            toast.error(error.message);
          }
        },
      });
    },
    (errors) => {
      haptics.error();
      const message = firstErrorMessage(errors);
      if (message) toast.error(message);
    },
  );

  const resend = () => {
    if (!email) return;
    resendOtp.mutate({ email }, { onSuccess: () => toast.success('We sent you a new code.') });
  };

  return {
    control: form.control,
    canSubmit,
    submit,
    resend,
    isVerifying: verifyOtp.isPending,
    isResending: resendOtp.isPending,
  };
}
