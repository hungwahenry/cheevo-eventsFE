import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import type { QuietHours } from '@/features/notifications/types';
import { QuietHoursPickerModal } from '@/features/notifications/components/quiet-hours-picker-modal';
import { useUpdateQuietHours } from '@/features/notifications/hooks';
import {
  formatTimeOfDay,
  formatTimeOfDayInput,
  parseTimeOfDay,
} from '@/lib/format/datetime';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  initial: QuietHours;
};

type Editing = 'start' | 'end' | null;

export function QuietHoursSection({ initial }: Props) {
  const update = useUpdateQuietHours();
  const enabled = initial.start !== null && initial.end !== null;
  const [editing, setEditing] = useState<Editing>(null);

  const handleToggle = (value: boolean) => {
    if (value) {
      update.mutate({ start: '22:00', end: '07:00', timezone: initial.timezone });
    } else {
      update.mutate({ start: null, end: null, timezone: initial.timezone });
    }
  };

  const handleSave = (which: 'start' | 'end', date: Date) => {
    setEditing(null);
    const next = formatTimeOfDayInput(date);
    update.mutate({
      start: which === 'start' ? next : initial.start,
      end: which === 'end' ? next : initial.end,
      timezone: initial.timezone,
    });
  };

  return (
    <View className="gap-4 px-5 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1 pr-3">
          <Text className="text-foreground text-sm font-sans-semibold">Quiet hours</Text>
          <Text className="text-muted-foreground text-xs">
            Pause push during a window. Email and in-app inbox still deliver.
          </Text>
        </View>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </View>

      {enabled ? (
        <>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setEditing('start')}
              className="border-border flex-1 flex-row items-center justify-between rounded-full border px-3 py-2">
              <Text className="text-muted-foreground text-xs">From</Text>
              <Text className="text-foreground text-sm font-sans-semibold">
                {formatTimeOfDay(initial.start) ?? '—'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setEditing('end')}
              className="border-border flex-1 flex-row items-center justify-between rounded-full border px-3 py-2">
              <Text className="text-muted-foreground text-xs">To</Text>
              <Text className="text-foreground text-sm font-sans-semibold">
                {formatTimeOfDay(initial.end) ?? '—'}
              </Text>
            </Pressable>
          </View>

          <Text className="text-muted-foreground text-xs">
            Push paused {formatTimeOfDay(initial.start)} – {formatTimeOfDay(initial.end)}
          </Text>
        </>
      ) : null}

      {editing !== null ? (
        <QuietHoursPickerModal
          label={editing === 'start' ? 'From' : 'To'}
          initial={parseTimeOfDay(editing === 'start' ? initial.start : initial.end)}
          onCancel={() => setEditing(null)}
          onSave={(date) => handleSave(editing, date)}
        />
      ) : null}
    </View>
  );
}
