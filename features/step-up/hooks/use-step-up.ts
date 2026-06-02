import * as stepUpApi from '@/features/step-up/api';
import type { CreateStepUpInput, StepUpChallenge } from '@/features/step-up/types';
import { useCallback, useState } from 'react';

type Status = 'idle' | 'creating' | 'awaiting' | 'verifying' | 'completed' | 'error';

export type UseStepUpResult = {
  status: Status;
  challenge: StepUpChallenge | null;
  error: string | null;
  start: (input: CreateStepUpInput) => Promise<void>;
  verify: (code: string) => Promise<void>;
  resend: () => Promise<void>;
  reset: () => void;
};

export function useStepUp(): UseStepUpResult {
  const [status, setStatus] = useState<Status>('idle');
  const [challenge, setChallenge] = useState<StepUpChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (input: CreateStepUpInput) => {
    setError(null);
    setStatus('creating');
    try {
      const result = await stepUpApi.createChallenge(input);
      setChallenge(result);
      setStatus(result.completed ? 'completed' : 'awaiting');
    } catch (e: any) {
      setError(e?.message ?? 'Could not start verification.');
      setStatus('error');
      throw e;
    }
  }, []);

  const verify = useCallback(
    async (code: string) => {
      if (!challenge?.next_factor_id) return;
      setError(null);
      setStatus('verifying');
      try {
        const result = await stepUpApi.verifyFactor(
          challenge.id,
          challenge.next_factor_id,
          code,
        );
        setChallenge(result);
        setStatus(result.completed ? 'completed' : 'awaiting');
      } catch (e: any) {
        setError(e?.message ?? 'Wrong code.');
        setStatus('awaiting');
        throw e;
      }
    },
    [challenge],
  );

  const resend = useCallback(async () => {
    if (!challenge?.next_factor_id) return;
    setError(null);
    try {
      await stepUpApi.resendFactor(challenge.id, challenge.next_factor_id);
    } catch (e: any) {
      setError(e?.message ?? 'Could not resend.');
      throw e;
    }
  }, [challenge]);

  const reset = useCallback(() => {
    setStatus('idle');
    setChallenge(null);
    setError(null);
  }, []);

  return { status, challenge, error, start, verify, resend, reset };
}
