import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useGiphySearch, type GiphyGif } from '@/lib/giphy';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Search, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type GifPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type GifPickerProps = {
  onSelect: (gif: GiphyGif) => void;
};

const SNAP_POINTS = ['90%'];
const COLUMN_GAP = 8;

export const GifPicker = React.forwardRef<GifPickerRef, GifPickerProps>(
  function GifPicker({ onSelect }, forwardedRef) {
    const ref = React.useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { theme } = useUniwind();
    const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

    const [query, setQuery] = React.useState('');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useGiphySearch(query);

    const items = React.useMemo(
      () => data?.pages.flatMap((p) => p.items) ?? [],
      [data]
    );

    React.useImperativeHandle(forwardedRef, () => ({
      present: () => ref.current?.present(),
      dismiss: () => ref.current?.dismiss(),
    }));

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleSelect = (gif: GiphyGif) => {
      onSelect(gif);
      setQuery('');
      ref.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        onDismiss={() => setQuery('')}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View className="px-4 pt-2 pb-3">
          <View className="bg-muted h-10 flex-row items-center gap-2 rounded-full px-3">
            <Icon as={Search} className="text-muted-foreground size-4" />
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
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
            {query.length > 0 ? (
              <Pressable
                onPress={() => setQuery('')}
                hitSlop={8}
                className="size-5 items-center justify-center rounded-full">
                <Icon as={X} className="text-muted-foreground size-4" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <BottomSheetFlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: COLUMN_GAP, paddingHorizontal: 16 }}
          contentContainerStyle={{
            gap: COLUMN_GAP,
            paddingBottom: insets.bottom + 16,
          }}
          renderItem={({ item }) => <GifTile gif={item} onPress={handleSelect} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center px-8 py-16">
                <Text className="text-muted-foreground text-sm">
                  No GIFs found.
                </Text>
              </View>
            ) : null
          }
        />
      </BottomSheetModal>
    );
  }
);

function GifTile({
  gif,
  onPress,
}: {
  gif: GiphyGif;
  onPress: (gif: GiphyGif) => void;
}) {
  const aspect = gif.height > 0 ? gif.width / gif.height : 1;

  return (
    <Pressable
      onPress={() => onPress(gif)}
      className="bg-muted flex-1 overflow-hidden rounded-xl"
      style={{ aspectRatio: aspect }}>
      <Image
        source={{ uri: gif.preview_url }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={120}
      />
    </Pressable>
  );
}
