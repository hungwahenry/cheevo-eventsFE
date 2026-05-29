import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable } from 'react-native';

function formatBirthday(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type BirthdayFieldProps = {
  value: string | null;
  onChange: (ymd: string) => void;
};

export function BirthdayField({ value, onChange }: BirthdayFieldProps) {
  const [show, setShow] = useState(false);

  const maximumDate = new Date();
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - 18);

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        className="border-input bg-background h-14 flex-row items-center gap-3 rounded-full border px-5">
        <Icon as={Calendar} className="text-muted-foreground size-5" strokeWidth={1.75} />
        <Text className={value ? 'text-foreground text-base' : 'text-muted-foreground text-base'}>
          {value ? formatBirthday(value) : 'Select your birthday'}
        </Text>
      </Pressable>

      {show ? (
        <DateTimePicker
          value={value ? new Date(`${value}T00:00:00`) : fallback}
          mode="date"
          maximumDate={maximumDate}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            if (Platform.OS === 'android') setShow(false);
            if (event.type === 'set' && date) {
              onChange(date.toISOString().slice(0, 10));
            }
          }}
        />
      ) : null}
    </>
  );
}
