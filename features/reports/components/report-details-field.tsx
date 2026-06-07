import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';

type Props = {
  value: string;
  onChange: (text: string) => void;
  required: boolean;
  maxLength: number;
};

export function ReportDetailsField({ value, onChange, required, maxLength }: Props) {
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  return (
    <View className="px-5 pt-3">
      <Text className="text-foreground mb-2 text-sm font-sans-medium">
        Details {required ? '' : '(optional)'}
      </Text>
      <View className="border-input rounded-md border bg-transparent px-3 py-2">
        <BottomSheetTextInput
          value={value}
          onChangeText={onChange}
          placeholder={
            required
              ? 'Required — tell us what happened.'
              : 'Anything you want our team to know.'
          }
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          style={{
            color: colors.foreground,
            fontSize: 15,
            lineHeight: 20,
            minHeight: 96,
            maxHeight: 160,
            paddingVertical: 0,
          }}
        />
      </View>
    </View>
  );
}
