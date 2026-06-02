import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';
import { ChevronLeftIcon, SearchIcon, XIcon } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';
import { useUniwind } from 'uniwind';

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
          <Icon as={ChevronLeftIcon} className="text-foreground" size={22} strokeWidth={2.25} />
        </Pressable>
      ) : null}
      <View className="bg-muted flex-1 flex-row items-center gap-2 rounded-full px-3">
        <Icon as={SearchIcon} className="text-muted-foreground" size={18} strokeWidth={2} />
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
            <Icon as={XIcon} className="text-muted-foreground" size={16} strokeWidth={2.25} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
