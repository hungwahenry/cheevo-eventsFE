import {
  CancelledState,
  ConfirmingState,
  FailedState,
  PaidState,
  PayingState,
  PendingState,
} from '@/features/checkout/components/payment-return';
import { usePaymentReturn } from '@/features/checkout/hooks/use-payment-return';
import { useActiveCheckoutStore } from '@/features/checkout/stores/active-checkout';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler, View } from 'react-native';

export default function PaymentReturnScreen() {
  const { phase, effectiveOrderId, cancel } = usePaymentReturn();

  // Lock the back button while we're mid-flow.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      return phase === 'paying' || phase === 'confirming';
    });
    return () => sub.remove();
  }, [phase]);

  const onContinue = useCallback(() => {
    useActiveCheckoutStore.getState().clear();
    if (phase === 'paid' || phase === 'pending') {
      router.replace('/(tabs)/tickets' as any);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [phase]);

  // Idle and no order id anywhere → arrived here by mistake. Bounce home,
  // but only after first render so we don't flash.
  useEffect(() => {
    if (phase === 'idle' && !effectiveOrderId) {
      router.replace('/(tabs)');
    }
  }, [phase, effectiveOrderId]);

  return (
    <View className="bg-background pt-safe-offset-2 flex-1 items-center justify-center px-6">
      {phase === 'paying' ? <PayingState onCancel={cancel} /> : null}
      {phase === 'confirming' ? <ConfirmingState /> : null}
      {phase === 'paid' ? <PaidState onContinue={onContinue} /> : null}
      {phase === 'pending' ? <PendingState onContinue={onContinue} /> : null}
      {phase === 'failed' ? <FailedState onContinue={onContinue} /> : null}
      {phase === 'cancelled' ? <CancelledState onContinue={onContinue} /> : null}
    </View>
  );
}
