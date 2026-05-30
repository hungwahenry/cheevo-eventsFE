import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Search, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useUniwind } from 'uniwind';

type GifPickerSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function GifPickerSearch({ value, onChange, onClear }: GifPickerSearchProps) {
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  return (
    <View className="px-4 pt-2 pb-3">
      <View className="bg-muted h-10 flex-row items-center gap-2 rounded-full px-3">
        <Icon as={Search} className="text-muted-foreground size-4" />
        <BottomSheetTextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search GIPHY"
          placeholderTextColor={colors.mutedForeground}
          style={{
            flex: 1,
            color: colors.foreground,
            fontSize: 16,
            paddingVertical: 0,
          }}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            className="size-5 items-center justify-center rounded-full">
            <Icon as={X} className="text-muted-foreground size-4" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
