import { createOrder } from '@/features/checkout/api';
import type { CartItem } from '@/features/checkout/types';
import { cancelOrder, verifyOrder } from '@/features/orders/api';
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
  /** Called when the user closes the payment browser without paying. */
  onCancelled?: () => void;
  /** Called after a successful payment (paid or pending capture). */
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
        cancelOrder(order.id).catch(() => {});
        return { order, cancelled: true as const };
      }

      const params = result.url ? Linking.parse(result.url).queryParams : null;
      const lookupKey =
        typeof params?.transaction_id === 'string' ? params.transaction_id : undefined;

      const verified = await verifyOrder(order.id, lookupKey);

      return { order: verified, cancelled: false as const };
    },
    onSuccess: ({ order, cancelled }) => {
      if (cancelled) {
        toast.info('Checkout cancelled.');
        options.onCancelled?.();
        return;
      }

      if (order.status === 'paid') {
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
      }
    },
  });
}
