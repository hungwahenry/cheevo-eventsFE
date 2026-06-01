import { SheetHeader } from '@/components/ui/sheet-header';
import { ReportDetailsField } from '@/features/reports/components/report-details-field';
import { ReportReasonsList } from '@/features/reports/components/report-reasons-list';
import { ReportSubmitFooter } from '@/features/reports/components/report-submit-footer';
import { useReportSheet } from '@/features/reports/hooks/use-report-sheet';
import type { ReportTarget } from '@/features/reports/types';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type ReportSheetRef = {
  present: (target: ReportTarget) => void;
  dismiss: () => void;
};

const SNAP_POINTS = ['75%'];

export const ReportSheet = React.forwardRef<ReportSheetRef>(function ReportSheet(_, fwd) {
  const sheetRef = React.useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  const sheet = useReportSheet({ onSuccess: () => sheetRef.current?.dismiss() });

  React.useImperativeHandle(fwd, () => ({
    present: (t) => {
      sheet.reset(t);
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
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
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      stackBehavior="push"
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
      <SheetHeader
        title={`Report ${sheet.target?.noun ?? 'this'}`}
        subtitle="Reports are private. Our team reviews each one."
      />

      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
        <ReportReasonsList
          reasons={sheet.reasons.data}
          isLoading={sheet.reasons.isLoading}
          selectedId={sheet.selectedReasonId}
          onSelect={sheet.setSelectedReasonId}
        />

        {sheet.selectedReasonId !== null ? (
          <ReportDetailsField
            value={sheet.details}
            onChange={sheet.setDetails}
            required={sheet.detailsRequired}
            maxLength={sheet.maxDetails}
          />
        ) : null}
      </BottomSheetScrollView>

      <ReportSubmitFooter
        onSubmit={sheet.submit}
        disabled={!sheet.canSubmit}
        isPending={sheet.isPending}
      />
    </BottomSheetModal>
  );
});
