import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';

type Props = {
  label: string;
  initial: Date;
  onCancel: () => void;
  onSave: (value: Date) => void;
};

export function QuietHoursPickerModal({ label, initial, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<Date>(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        mode="time"
        value={initial}
        onChange={(event, date) => {
          if (event.type === 'set' && date) onSave(date);
          else onCancel();
        }}
      />
    );
  }

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable onPress={onCancel} className="flex-1 justify-center bg-black/40 px-8">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-card rounded-2xl px-4 py-5">
            <Text className="text-foreground text-center text-base font-semibold">{label}</Text>
            <DateTimePicker
              mode="time"
              display="spinner"
              value={draft}
              onChange={(_, date) => date && setDraft(date)}
            />
            <View className="flex-row gap-3 pt-2">
              <Button variant="outline" className="flex-1" onPress={onCancel}>
                <Text>Cancel</Text>
              </Button>
              <Button className="flex-1" onPress={() => onSave(draft)}>
                <Text>Save</Text>
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
