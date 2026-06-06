import { createOrder } from '@/features/checkout/api';
import {
  isTerminalPhase,
  useActiveCheckoutStore,
  type CheckoutPhase,
} from '@/features/checkout/stores/active-checkout';
import type { CartItem } from '@/features/checkout/types';
import { getOrder } from '@/features/orders/api';
import type { Order } from '@/features/orders/types';
import { isApiError } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { toast } from 'sonner-native';

type StartCheckoutArgs = {
  eventId: string;
  items: CartItem[];
};

type Options = {
  onCancelled?: () => void;
  onConfirmed?: (order: Order) => void;
};

type Outcome =
  | { kind: 'confirmed'; order: Order; phase: CheckoutPhase; free: boolean }
  | { kind: 'cancelled' };

async function waitForTerminalPhase(): Promise<CheckoutPhase> {
  return new Promise((resolve) => {
    const initial = useActiveCheckoutStore.getState().phase;
    if (isTerminalPhase(initial)) {
      resolve(initial);
      return;
    }
    const unsub = useActiveCheckoutStore.subscribe((state) => {
      if (isTerminalPhase(state.phase)) {
        unsub();
        resolve(state.phase);
      }
    });
  });
}

export function useCheckout(options: Options = {}) {
  return useMutation<Outcome, unknown, StartCheckoutArgs>({
    mutationFn: async ({ eventId, items }) => {
      const callbackUrl = Linking.createURL('/orders/return');

      const { order, authorization_url } = await createOrder(eventId, {
        items,
        callback_url: callbackUrl,
      });

      // Free order — no provider hop, fulfilled by the backend already.
      if (!authorization_url) {
        return { kind: 'confirmed', order, phase: 'paid', free: true };
      }

      useActiveCheckoutStore.getState().setActive(order.id, authorization_url);
      router.push('/orders/return' as any);

      const phase = await waitForTerminalPhase();

      if (phase === 'cancelled') {
        // Route already showed a Cancelled card and the user has dismissed.
        return { kind: 'cancelled' };
      }

      const fresh = await getOrder(order.id).catch(() => order);
      return { kind: 'confirmed', order: fresh, phase, free: false };
    },
    onSuccess: (outcome) => {
      if (outcome.kind === 'cancelled') {
        options.onCancelled?.();
        return;
      }
      // Free orders skipped the status screen, so toast here.
      // Paid/pending/failed orders are surfaced by the status screen itself.
      if (outcome.free) {
        toast.success('Tickets confirmed!');
      }
      options.onConfirmed?.(outcome.order);
    },
    onError: (error) => {
      useActiveCheckoutStore.getState().clear();
      if (isApiError(error) && error.isValidation) {
        const first = Object.values(error.fieldErrors())[0];
        toast.error(first ?? error.message);
        return;
      }
      toast.error(isApiError(error) ? error.message : 'Checkout failed. Please try again.');
    },
  });
}
