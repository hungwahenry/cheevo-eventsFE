import * as Calendar from 'expo-calendar';

export type CalendarEventInput = {
  title: string;
  startsAt: string;
  endsAt: string | null;
  timezone?: string | null;
  location?: string | null;
  notes?: string | null;
};

export type AddToCalendarResult = 'added' | 'denied' | 'no-calendar' | 'failed';

export async function addToCalendar(input: CalendarEventInput): Promise<AddToCalendarResult> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return 'denied';

  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const writable =
      calendars.find(
        (c) => c.allowsModifications && (c.source?.name === 'Default' || c.isPrimary),
      ) ?? calendars.find((c) => c.allowsModifications);

    if (!writable) return 'no-calendar';

    const starts = new Date(input.startsAt);
    const ends = input.endsAt
      ? new Date(input.endsAt)
      : new Date(starts.getTime() + 3 * 60 * 60 * 1000);

    await Calendar.createEventAsync(writable.id, {
      title: input.title,
      startDate: starts,
      endDate: ends,
      location: input.location ?? undefined,
      notes: input.notes ?? undefined,
      timeZone: input.timezone ?? undefined,
    });

    return 'added';
  } catch {
    return 'failed';
  }
}
