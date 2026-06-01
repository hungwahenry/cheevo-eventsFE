import { StatusPill } from '@/components/ui/status-pill';
import { Text } from '@/components/ui/text';
import { QuantityStepper } from '@/features/checkout/components/quantity-stepper';
import type { EventDetailTicket } from '@/features/event-detail/types';
import { formatDateRange, formatShortDate } from '@/lib/format/datetime';
import { formatMoney } from '@/lib/format/money';
import { getTicketAvailability } from '@/lib/tickets';
import { View } from 'react-native';

type TicketPickerRowProps = {
  ticket: EventDetailTicket;
  currency: string;
  quantity: number;
  onChange: (next: number) => void;
};

export function TicketPickerRow({
  ticket,
  currency,
  quantity,
  onChange,
}: TicketPickerRowProps) {
  const showCompare =
    ticket.display_price !== null && ticket.display_price > ticket.gross_price;
  const { remaining, soldOut, maxPurchasable } = getTicketAvailability(ticket);
  const meta = buildMeta(ticket);
  const isSelected = quantity > 0;

  return (
    <View
      className={`gap-3 rounded-2xl p-4 ${
        isSelected ? 'bg-primary/10' : 'bg-muted'
      } ${soldOut ? 'opacity-60' : ''}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
            <Text className="text-foreground text-base font-semibold" numberOfLines={1}>
              {ticket.name}
            </Text>
            {soldOut ? (
              <StatusPill label="Sold out" tone="muted" size="sm" />
            ) : remaining !== null && remaining <= 10 ? (
              <StatusPill label={`${remaining} left`} tone="destructive" size="sm" />
            ) : null}
          </View>
          {meta ? (
            <Text className="text-muted-foreground mt-0.5 text-xs" numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="text-foreground text-lg leading-tight font-bold">
            {formatMoney(ticket.gross_price, currency)}
          </Text>
          {showCompare ? (
            <Text className="text-muted-foreground text-xs line-through">
              {formatMoney(ticket.display_price as number, currency)}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {remaining !== null && remaining > 10 ? (
          <Text className="text-muted-foreground text-xs">{remaining} left</Text>
        ) : (
          <View />
        )}
        <QuantityStepper
          value={quantity}
          onChange={onChange}
          max={soldOut ? 0 : maxPurchasable}
        />
      </View>
    </View>
  );
}

function buildMeta(ticket: EventDetailTicket): string {
  const parts: string[] = [];

  if (ticket.sales_ends_at) {
    parts.push(`Closes ${formatShortDate(ticket.sales_ends_at)}`);
  }
  const validity = formatDateRange(ticket.valid_from, ticket.valid_to);
  if (validity) {
    parts.push(`Valid ${validity}`);
  }
  if (ticket.max_per_order !== null) {
    parts.push(`Max ${ticket.max_per_order}/order`);
  }

  return parts.join(' · ');
}
