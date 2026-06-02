import { useCurrentUser, useSessionStore } from '@/features/auth';
import { useStepUp } from '@/features/step-up';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Stage = 'collect' | 'verify' | 'done';

export function useChangeEmail() {
  const user = useCurrentUser();
  const setUser = useSessionStore((s) => s.setUser);
  const stepUp = useStepUp();

  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');

  const stage: Stage =
    stepUp.status === 'completed'
      ? 'done'
      : stepUp.challenge && !stepUp.challenge.completed
      ? 'verify'
      : 'collect';

  const normalizedEmail = newEmail.trim().toLowerCase();
  const emailValid = EMAIL_REGEX.test(normalizedEmail);
  const isSameAsCurrent = normalizedEmail === (user?.email ?? '').trim().toLowerCase();

  const nextFactor = stepUp.challenge?.factors.find(
    (f) => f.id === stepUp.challenge?.next_factor_id,
  );
  const factorsTotal = stepUp.challenge?.factors.length ?? 0;
  const factorIndex = nextFactor ? nextFactor.position + 1 : 0;

  const start = async () => {
    if (!emailValid) {
      haptics.error();
      toast.error('Enter a valid email.');
      return;
    }
    if (isSameAsCurrent) {
      haptics.error();
      toast.error('That is already your email.');
      return;
    }
    try {
      await stepUp.start({
        action: 'change_email',
        payload: { new_email: normalizedEmail },
      });
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
    const updatedUser = stepUp.challenge?.result?.user;
    if (updatedUser) setUser(updatedUser);
    toast.success('Email updated');
    router.back();
  }, [stepUp.status, stepUp.challenge, setUser]);

  return {
    user,
    stage,
    newEmail,
    setNewEmail,
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
