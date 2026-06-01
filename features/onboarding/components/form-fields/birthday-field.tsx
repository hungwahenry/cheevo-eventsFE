import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Sheet, type SheetRef } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { formatBirthday } from '@/lib/format/datetime';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

function toYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

type BirthdayFieldProps = {
  value: string | null;
  onChange: (ymd: string) => void;
};

export function BirthdayField({ value, onChange }: BirthdayFieldProps) {
  const maximumDate = new Date();
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - 18);
  const selected = value ? new Date(`${value}T00:00:00`) : fallback;

  const sheetRef = useRef<SheetRef>(null);
  const [androidShow, setAndroidShow] = useState(false);
  const [temp, setTemp] = useState(selected);

  const open = () => {
    setTemp(selected);
    if (Platform.OS === 'android') setAndroidShow(true);
    else sheetRef.current?.present();
  };

  const onAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    setAndroidShow(false);
    if (event.type === 'set' && date) onChange(toYmd(date));
  };

  const commit = () => {
    onChange(toYmd(temp));
    sheetRef.current?.dismiss();
  };

  return (
    <>
      <Pressable
        onPress={open}
        className="border-input bg-background h-14 flex-row items-center gap-3 rounded-full border px-5">
        <Icon as={Calendar} className="text-muted-foreground size-5" strokeWidth={1.75} />
        <Text className={value ? 'text-foreground text-base' : 'text-muted-foreground text-base'}>
          {value ? formatBirthday(value) : 'Select your birthday'}
        </Text>
      </Pressable>

      {Platform.OS === 'android' && androidShow ? (
        <DateTimePicker
          value={selected}
          mode="date"
          maximumDate={maximumDate}
          onChange={onAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Sheet ref={sheetRef}>
          <View className="border-border flex-row items-center justify-between border-b px-2 py-2">
            <Button variant="ghost" size="sm" onPress={() => sheetRef.current?.dismiss()}>
              <Text>Cancel</Text>
            </Button>
            <Text className="text-foreground text-base font-semibold">Birthday</Text>
            <Button variant="link" size="sm" onPress={commit}>
              <Text>Done</Text>
            </Button>
          </View>
          <DateTimePicker
            value={temp}
            mode="date"
            display="spinner"
            maximumDate={maximumDate}
            onChange={(_, date) => date && setTemp(date)}
            style={{ height: 216, alignSelf: 'center', marginVertical: 8 }}
          />
        </Sheet>
      ) : null}
    </>
  );
}
