import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type SheetRef = {
  present: () => void;
  dismiss: () => void;
};

type SheetProps = {
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
  children: React.ReactNode;
};

/** Themed bottom sheet (gorhom modal). Open/close imperatively via ref.present()/dismiss(). */
export const Sheet = React.forwardRef<SheetRef, SheetProps>(function Sheet(
  { snapPoints, onDismiss, children },
  forwardedRef
) {
  const ref = React.useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

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
      snapPoints={snapPoints}
      enableDynamicSizing={snapPoints === undefined}
      topInset={insets.top}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
      <BottomSheetView style={{ paddingBottom: insets.bottom + 8 }}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});
