import { GifPickerGrid } from '@/components/gif-picker/gif-picker-grid';
import { GifPickerSearch } from '@/components/gif-picker/gif-picker-search';
import { useGifPickerState } from '@/components/gif-picker/use-gif-picker-state';
import { Text } from '@/components/ui/text';
import { type PickedGif } from '@/lib/giphy';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type GifPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type GifPickerProps = {
  onSelect: (gif: PickedGif) => void;
};

const SNAP_POINTS = ['90%'];

export const GifPicker = React.forwardRef<GifPickerRef, GifPickerProps>(
  function GifPicker({ onSelect }, forwardedRef) {
    const ref = React.useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { theme } = useUniwind();
    const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

    const gif = useGifPickerState({
      onSelect,
      onDone: () => ref.current?.dismiss(),
    });

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

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        topInset={insets.top}
        onDismiss={gif.handleClear}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View className="flex-1">
          <GifPickerSearch
            value={gif.query}
            onChange={gif.setQuery}
            onClear={gif.handleClear}
          />
          <GifPickerGrid
            items={gif.items}
            query={gif.debouncedQuery}
            isLoading={gif.isLoading}
            isError={gif.isError}
            hasNextPage={gif.hasNextPage}
            isFetchingNextPage={gif.isFetchingNextPage}
            onFetchNextPage={gif.fetchNextPage}
            onSelect={gif.handleSelect}
          />
          <View className="border-border items-center border-t px-4 py-2">
            <Text className="text-muted-foreground text-[10px] tracking-wider uppercase">
              Powered by GIPHY
            </Text>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);
