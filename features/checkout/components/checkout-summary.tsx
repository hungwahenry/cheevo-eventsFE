import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import type { OrderQuote } from '@/features/checkout/types';
import { formatMoney } from '@/lib/format/money';
import { ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

type CheckoutSummaryProps = {
  quote: OrderQuote | undefined;
  isQuoting: boolean;
  hasQuoteError: boolean;
  isCheckingOut: boolean;
  canCheckout: boolean;
  currency: string;
  onCheckout: () => void;
};

export function CheckoutSummary({
  quote,
  isQuoting,
  hasQuoteError,
  isCheckingOut,
  canCheckout,
  currency,
  onCheckout,
}: CheckoutSummaryProps) {
  return (
    <View className="border-border border-t px-5 pt-3 pb-safe-offset-3">
      <View className="gap-1">
        <PriceRow
          label="Subtotal"
          value={quote ? formatMoney(quote.subtotal_minor, quote.currency) : '—'}
        />
        <PriceRow
          label="Service fee"
          value={quote ? formatMoney(quote.fees_minor, quote.currency) : '—'}
        />
        <View className="border-border border-t pt-2">
          <PriceRow
            label="Total"
            value={
              quote
                ? formatMoney(quote.total_minor, quote.currency)
                : formatMoney(0, currency)
            }
            emphasis
          />
        </View>
      </View>

      {hasQuoteError ? (
        <Text className="text-destructive mt-2 text-xs">
          Couldn&apos;t price your selection. Check your connection and try again.
        </Text>
      ) : null}

      <Button
        size="lg"
        className="mt-4"
        disabled={!canCheckout || isCheckingOut || isQuoting || hasQuoteError}
        onPress={onCheckout}>
        {isCheckingOut ? (
          <Spinner size="sm" barClassName="bg-primary-foreground" />
        ) : (
          <>
            <Text>Checkout</Text>
            <Icon
              as={ArrowRight}
              className="text-primary-foreground size-4"
              strokeWidth={2.25}
            />
          </>
        )}
      </Button>
    </View>
  );
}

function PriceRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        className={
          emphasis
            ? 'text-foreground text-base font-semibold'
            : 'text-muted-foreground text-sm'
        }>
        {label}
      </Text>
      <Text
        className={
          emphasis
            ? 'text-foreground text-lg font-bold'
            : 'text-foreground text-sm'
        }>
        {value}
      </Text>
    </View>
  );
}
