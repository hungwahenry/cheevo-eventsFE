import { sendOtpSchema, type SendOtpInput } from '@/features/auth/validation';
import { isApiError } from '@/lib/api';
import { haptics } from '@/lib/haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useSendOtp } from './use-auth-mutations';

export function useEmailForm() {
  const form = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });
  const sendOtp = useSendOtp();
  const canSubmit = sendOtpSchema.safeParse(form.watch()).success;

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
    canSubmit,
    submit,
    isPending: sendOtp.isPending,
  };
}
