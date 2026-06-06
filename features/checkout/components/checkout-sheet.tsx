import { EmptyState } from '@/components/ui/empty-state';
import { SheetHeader } from '@/components/ui/sheet-header';
import { CheckoutSummary } from '@/features/checkout/components/checkout-summary';
import { TicketPickerRow } from '@/features/checkout/components/ticket-picker-row';
import { useCart, useCheckout, useQuote } from '@/features/checkout/hooks';
import type { EventDetail, EventDetailTicket } from '@/features/event-detail/types';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ticket } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '@/lib/theme';
import { getOnSaleTickets } from '@/lib/tickets';
import { toast } from 'sonner-native';
import { useUniwind } from 'uniwind';

export type CheckoutSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type CheckoutSheetProps = {
  event: EventDetail;
};

const SNAP_POINTS = ['90%'];

export const CheckoutSheet = React.forwardRef<CheckoutSheetRef, CheckoutSheetProps>(
  function CheckoutSheet({ event }, forwardedRef) {
    const ref = React.useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { theme } = useUniwind();
    const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

    const cart = useCart();
    const quote = useQuote(event.id, cart.items);
    const checkout = useCheckout({
      onConfirmed: () => {
        cart.clear();
      },
    });

    React.useEffect(() => {
      if (quote.isError) {
        toast.error("Couldn't price your selection. Check your connection and try again.");
      }
    }, [quote.isError]);

    const tickets = React.useMemo(
      () => getOnSaleTickets(event.tickets),
      [event.tickets]
    );

    React.useImperativeHandle(forwardedRef, () => ({
      present: () => ref.current?.present(),
      dismiss: () => ref.current?.dismiss(),
    }));

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleCheckout = () => {
      if (cart.items.length === 0) return;
      ref.current?.dismiss();
      checkout.mutate({ eventId: event.id, items: cart.items });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        topInset={insets.top}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View className="flex-1">
          <SheetHeader title="Get tickets" subtitle="Pick how many of each to get." />

          <CheckoutTicketList
            tickets={tickets}
            currency={event.currency}
            quantityOf={cart.quantityOf}
            setQuantity={cart.setQuantity}
          />

          <CheckoutSummary
            quote={quote.data}
            isQuoting={quote.isFetching}
            hasQuoteError={quote.isError}
            isCheckingOut={checkout.isPending}
            canCheckout={cart.items.length > 0}
            currency={event.currency}
            onCheckout={handleCheckout}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

function CheckoutTicketList({
  tickets,
  currency,
  quantityOf,
  setQuantity,
}: {
  tickets: EventDetailTicket[];
  currency: string;
  quantityOf: (id: string) => number;
  setQuantity: (id: string, qty: number) => void;
}) {
  if (tickets.length === 0) {
    return (
      <View className="flex-1 justify-center">
        <EmptyState
          icon={Ticket}
          title="No tickets on sale"
          description="Sales haven't opened yet — check back soon."
        />
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      data={tickets}
      keyExtractor={(t) => t.id}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 10 }}
      renderItem={({ item }) => (
        <TicketPickerRow
          ticket={item}
          currency={currency}
          quantity={quantityOf(item.id)}
          onChange={(next) => setQuantity(item.id, next)}
        />
      )}
    />
  );
}
