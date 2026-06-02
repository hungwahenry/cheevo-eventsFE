import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ChevronLeftIcon, SearchIcon, XIcon } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';
import { useUniwind } from 'uniwind';
import { THEME } from '@/lib/theme';

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showBack?: boolean;
};

export function SearchBar({ value, onChange, placeholder, autoFocus, showBack }: Props) {
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <View className="flex-row items-center gap-2 px-3 pt-2 pb-3">
      {showBack ? (
        <Pressable onPress={() => router.back()} hitSlop={10} className="size-9 items-center justify-center">
          <ChevronLeftIcon size={22} color={palette.foreground} strokeWidth={2.25} />
        </Pressable>
      ) : null}
      <View className="bg-muted flex-1 flex-row items-center gap-2 rounded-full px-3">
        <SearchIcon size={18} color={palette.mutedForeground} strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChange}
          autoFocus={autoFocus}
          placeholder={placeholder ?? 'Search events, orgs, people'}
          placeholderTextColor={palette.mutedForeground}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          className="text-foreground flex-1 py-2.5 text-sm"
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChange('')} hitSlop={8}>
            <XIcon size={16} color={palette.mutedForeground} strokeWidth={2.25} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
