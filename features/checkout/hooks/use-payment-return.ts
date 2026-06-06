import {
  useActiveCheckoutStore,
  type CheckoutPhase,
} from '@/features/checkout/stores/active-checkout';
import { verifyOrder } from '@/features/orders/api';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const CANCEL_GRACE_MS = 1500;

function safeDismissBrowser(): void {
  try {
    WebBrowser.dismissBrowser();
  } catch {}
}

export type UsePaymentReturn = {
  phase: CheckoutPhase;
  effectiveOrderId: string | null;
  cancel: () => void;
};

export function usePaymentReturn(): UsePaymentReturn {
  const params = useLocalSearchParams<{
    reference?: string;
    transaction_id?: string;
    order_id?: string;
  }>();
  const storeOrderId = useActiveCheckoutStore((s) => s.orderId);
  const authorizationUrl = useActiveCheckoutStore((s) => s.authorizationUrl);
  const phase = useActiveCheckoutStore((s) => s.phase);
  const setPhase = useActiveCheckoutStore((s) => s.setPhase);

  const urlOrderId = typeof params.order_id === 'string' ? params.order_id : null;
  const effectiveOrderId = storeOrderId ?? urlOrderId;

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const hasPaymentParams = Boolean(params.reference) || Boolean(params.transaction_id);

  useEffect(() => {
    if (phase === 'idle' && authorizationUrl && !hasPaymentParams) {
      setPhase('paying');
      WebBrowser.openBrowserAsync(authorizationUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      }).catch(() => {});
    }
  }, [phase, authorizationUrl, hasPaymentParams, setPhase]);

  useEffect(() => {
    if (!hasPaymentParams) return;
    if (phase !== 'paying' && phase !== 'idle') return;
    if (!effectiveOrderId) return;

    setPhase('confirming');
    safeDismissBrowser();

    const lookupKey =
      typeof params.transaction_id === 'string' ? params.transaction_id : undefined;

    verifyOrder(effectiveOrderId, lookupKey).then(
      (verified) => {
        if (phaseRef.current === 'confirming') {
          setPhase(verified.status === 'paid' ? 'paid' : 'pending');
        }
      },
      () => {
        if (phaseRef.current === 'confirming') {
          setPhase('failed');
        }
      }
    );
  }, [hasPaymentParams, phase, effectiveOrderId, params.transaction_id, setPhase]);

  useEffect(() => {
    if (phase !== 'paying') return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (phaseRef.current === 'paying') {
          setPhase('cancelled');
        }
      }, CANCEL_GRACE_MS);
    });

    return () => {
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, [phase, setPhase]);

  const cancel = useCallback(() => {
    safeDismissBrowser();
    setPhase('cancelled');
  }, [setPhase]);

  return { phase, effectiveOrderId, cancel };
}
