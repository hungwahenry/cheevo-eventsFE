import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { TicketStatusPill } from '@/features/tickets/components/ticket-status-pill';
import { TicketScreenHeader } from '@/features/tickets/components/ticket-screen-header';
import { useMyTicket } from '@/features/tickets/hooks';
import { formatShortDateTime } from '@/lib/format/datetime';
import * as Sharing from 'expo-sharing';
import { ShareIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { toast } from 'sonner-native';
import { useUniwind } from 'uniwind';

export function TicketDetail({ ticketId }: { ticketId: string }) {
  const { data: ticket, isLoading } = useMyTicket(ticketId);
  const { theme } = useUniwind();
  const shotRef = useRef<ViewShot>(null);

  if (isLoading || !ticket) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  const when = formatShortDateTime(ticket.event.starts_at);
  const venue = ticket.event.venue_name ?? ticket.event.city;
  const dimmed = ticket.status !== 'valid';

  const qrFg = theme === 'dark' ? '#fafafa' : '#0a0a0a';
  const qrBg = theme === 'dark' ? '#0a0a0a' : '#ffffff';

  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      toast.error('Sharing is not available on this device.');
      return;
    }
    try {
      const uri = await shotRef.current?.capture?.();
      if (!uri) return;
      await Sharing.shareAsync(uri, {
        dialogTitle: `${ticket.event.title} — ${ticket.ticket_name}`,
        mimeType: 'image/png',
        UTI: 'public.png',
      });
    } catch {
      toast.error('Could not share ticket.');
    }
  };

  return (
    <View className="bg-background flex-1">
      <TicketScreenHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mx-4 mt-2 items-center gap-1">
          <Text className="text-foreground text-xl font-semibold" numberOfLines={2}>
            {ticket.event.title}
          </Text>
          {when ? <Text className="text-muted-foreground text-sm">{when}</Text> : null}
          {venue ? (
            <Text className="text-muted-foreground text-sm" numberOfLines={1}>
              {venue}
            </Text>
          ) : null}
        </View>

        <ViewShot
          ref={shotRef}
          options={{ format: 'png', quality: 1, result: 'tmpfile' }}
          style={{ marginHorizontal: 16, marginTop: 24, backgroundColor: 'transparent' }}>
          <View className="items-center gap-4 rounded-2xl bg-card p-6">
            <View className="flex-row items-center gap-2">
              <Text className="text-foreground text-base font-semibold">
                {ticket.ticket_name}
              </Text>
              <TicketStatusPill status={ticket.status} />
            </View>

            <View
              className="items-center justify-center rounded-xl bg-white p-4"
              style={{ opacity: dimmed ? 0.35 : 1 }}>
              <QRCode value={ticket.code} size={220} color={qrFg} backgroundColor={qrBg} />
            </View>

            <Text className="text-muted-foreground font-mono text-xs tracking-wider">
              {ticket.code}
            </Text>

            {ticket.status === 'scanned' ? (
              <Text className="text-muted-foreground text-center text-xs">
                Scanned at the door — this ticket has already been used.
              </Text>
            ) : ticket.status === 'revoked' ? (
              <Text className="text-destructive text-center text-xs">
                This ticket has been revoked.
              </Text>
            ) : (
              <Text className="text-muted-foreground text-center text-xs">
                Show this code at the door. Keep your phone bright.
              </Text>
            )}
          </View>
        </ViewShot>
      </ScrollView>

      <View className="bg-background pb-safe-offset-4 px-4 pt-3">
        <Button variant="outline" onPress={handleShare}>
          <Icon as={ShareIcon} className="size-4" />
          <Text>Share</Text>
        </Button>
      </View>
    </View>
  );
}
