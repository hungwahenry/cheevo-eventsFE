import { createOrder } from '@/features/checkout/api';
import type { CartItem } from '@/features/checkout/types';
import { cancelOrder, getOrder, verifyOrder } from '@/features/orders/api';
import type { Order } from '@/features/orders/types';
import { isApiError } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { toast } from 'sonner-native';

type StartCheckoutArgs = {
  eventId: string;
  items: CartItem[];
};

type Options = {
  onCancelled?: () => void;
  onConfirmed?: (order: Order) => void;
};

export function useCheckout(options: Options = {}) {
  return useMutation({
    mutationFn: async ({ eventId, items }: StartCheckoutArgs) => {
      const callbackUrl = Linking.createURL('/orders/return');

      const { order, authorization_url } = await createOrder(eventId, {
        items,
        callback_url: callbackUrl,
      });

      if (!authorization_url) {
        return { order, cancelled: false as const };
      }

      const result = await WebBrowser.openAuthSessionAsync(authorization_url, callbackUrl);

      if (result.type !== 'success') {
        // The user may have actually paid and dismissed the browser before the
        // redirect fired (common on iOS Paystack). Probe the order state before
        // cancelling so we don't trash a paid order.
        try {
          const probed = await getOrder(order.id);
          if (probed.status === 'paid') {
            return { order: probed, cancelled: false as const };
          }
        } catch {}
        cancelOrder(order.id).catch(() => {});
        return { order, cancelled: true as const };
      }

      const params = result.url ? Linking.parse(result.url).queryParams : null;
      const lookupKey =
        typeof params?.transaction_id === 'string' ? params.transaction_id : undefined;

      try {
        const verified = await verifyOrder(order.id, lookupKey);
        return { order: verified, cancelled: false as const };
      } catch (e) {
        // Verify can fail with the webhook still in flight. Fall back to the
        // last-known order — onSuccess will show the right "we'll confirm"
        // copy, and the order detail screen will pick up the final status when
        // the webhook lands.
        return { order, cancelled: false as const, verifyFailed: true as const };
      }
    },
    onSuccess: ({ order, cancelled, verifyFailed }) => {
      if (cancelled) {
        toast.info('Checkout cancelled.');
        options.onCancelled?.();
        return;
      }

      if (verifyFailed) {
        toast.info("Payment received — we'll confirm shortly.");
      } else if (order.status === 'paid') {
        toast.success('Tickets confirmed!');
      } else {
        toast.success("Payment received — we'll confirm shortly.");
      }
      options.onConfirmed?.(order);
    },
    onError: (error) => {
      if (isApiError(error) && error.isValidation) {
        const first = Object.values(error.fieldErrors())[0];
        toast.error(first ?? error.message);
        return;
      }
      toast.error(isApiError(error) ? error.message : 'Checkout failed. Please try again.');
    },
  });
}
