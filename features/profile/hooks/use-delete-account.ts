import { useSessionStore } from '@/features/auth';
import { useStepUp } from '@/features/step-up';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner-native';

type Stage = 'confirm' | 'verify' | 'done';

export function useDeleteAccount() {
  const forceUnauthenticated = useSessionStore((s) => s.forceUnauthenticated);
  const stepUp = useStepUp();
  const [code, setCode] = useState('');

  const stage: Stage =
    stepUp.status === 'completed'
      ? 'done'
      : stepUp.challenge && !stepUp.challenge.completed
      ? 'verify'
      : 'confirm';

  const nextFactor = stepUp.challenge?.factors.find(
    (f) => f.id === stepUp.challenge?.next_factor_id,
  );
  const factorsTotal = stepUp.challenge?.factors.length ?? 0;
  const factorIndex = nextFactor ? nextFactor.position + 1 : 0;

  const start = async () => {
    try {
      await stepUp.start({ action: 'delete_account', payload: {} });
      haptics.select();
    } catch (e: any) {
      haptics.error();
      toast.error(e?.message ?? 'Could not start verification.');
    }
  };

  const submitCode = async (value: string) => {
    if (value.length !== 6) return;
    try {
      await stepUp.verify(value);
      setCode('');
      haptics.success();
    } catch (e: any) {
      setCode('');
      haptics.error();
      toast.error(e?.message ?? 'Wrong code.');
    }
  };

  const resend = async () => {
    try {
      await stepUp.resend();
      toast.success('We sent you a new code.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not resend.');
    }
  };

  useEffect(() => {
    if (stepUp.status !== 'completed') return;
    forceUnauthenticated();
    toast.success('Your account has been deleted.');
    router.replace('/welcome' as any);
  }, [stepUp.status, forceUnauthenticated]);

  return {
    stage,
    code,
    setCode,
    nextFactor,
    factorsTotal,
    factorIndex,
    isStarting: stepUp.status === 'creating',
    isVerifying: stepUp.status === 'verifying',
    start,
    submitCode,
    resend,
  };
}
