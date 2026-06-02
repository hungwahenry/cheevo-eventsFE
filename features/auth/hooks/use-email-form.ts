import { sendOtpSchema, type SendOtpInput } from '@/features/auth/validation';
import { isApiError } from '@/lib/api';
import { firstErrorMessage } from '@/lib/form-errors';
import { haptics } from '@/lib/haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { useSendOtp } from './use-auth-mutations';

export function useEmailForm() {
  const form = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });
  const sendOtp = useSendOtp();
  const canSubmit = sendOtpSchema.safeParse(form.watch()).success;

  const submit = form.handleSubmit(
    (data) => {
      haptics.select();
      sendOtp.mutate(data, {
        onSuccess: () => {
          haptics.success();
          router.push({ pathname: '/verify', params: { email: data.email } });
        },
        onError: (error) => {
          haptics.error();
          if (isApiError(error)) {
            toast.error(error.fieldErrors().email ?? error.message);
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

  return {
    control: form.control,
    canSubmit,
    submit,
    isPending: sendOtp.isPending,
  };
}
