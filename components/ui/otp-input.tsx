import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export function OtpInput({
  value,
  onChangeText,
  onComplete,
  length = 6,
  autoFocus,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(autoFocus ?? false);

  const focus = () => inputRef.current?.focus();
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <Pressable onPress={focus}>
        <View className="flex-row justify-between gap-2">
          {Array.from({ length }).map((_, i) => {
            const char = value[i] ?? '';
            const isActive = focused && i === activeIndex && value.length < length;
            const isFilled = i < value.length;
            return (
              <View
                key={i}
                className={cn(
                  'bg-background h-14 flex-1 items-center justify-center rounded-2xl border',
                  isActive
                    ? 'border-primary border-[1.5px]'
                    : isFilled
                    ? 'border-foreground/40'
                    : 'border-input',
                )}>
                <Text className="text-foreground text-2xl font-semibold">{char}</Text>
              </View>
            );
          })}
        </View>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, '').slice(0, length);
            onChangeText(cleaned);
            if (cleaned.length === length) onComplete?.(cleaned);
          }}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus}
          returnKeyType="go"
          onSubmitEditing={() => onComplete?.(value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          caretHidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
          }}
        />
      </Pressable>
    </View>
  );
}
