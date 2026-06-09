export function routeForNotification(
  type: string | undefined,
  data: Record<string, any>
): string | null {
  const eventTarget = data.event_slug ?? data.event_id;

  switch (type) {
    case 'attendee.order_paid':
      return '/(tabs)/tickets';
    case 'attendee.event_starting_soon':
    case 'attendee.new_event_from_subscription':
    case 'attendee.comment_reply':
      return eventTarget ? `/events/${eventTarget}` : null;
    case 'admin.system_announcement':
      return '/(tabs)/inbox';
    default:
      return null;
  }
}
