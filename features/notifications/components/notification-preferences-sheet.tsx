import { SheetHeader } from '@/components/ui/sheet-header';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from '@/features/notifications/hooks';
import { PreferenceTypeRow } from '@/features/notifications/components/preference-type-row';
import { QuietHoursSection } from '@/features/notifications/components/quiet-hours-section';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type NotificationPreferencesSheetRef = {
  present: () => void;
  dismiss: () => void;
};

const SNAP_POINTS = ['85%'];

export const NotificationPreferencesSheet = React.forwardRef<NotificationPreferencesSheetRef>(
  function NotificationPreferencesSheet(_, fwd) {
    const sheetRef = React.useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { theme } = useUniwind();
    const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

    const { data, isLoading } = useNotificationPreferences();
    const update = useUpdateNotificationPreference();

    React.useImperativeHandle(fwd, () => ({
      present: () => sheetRef.current?.present(),
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

    const attendeeTypes = (data?.types ?? []).filter((t) => t.audience === 'attendee');

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        topInset={insets.top}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <SheetHeader
          title="Notification settings"
          subtitle="Choose what reaches you and when."
        />

        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
          {isLoading || !data ? (
            <View className="items-center py-12">
              <Spinner />
            </View>
          ) : (
            <>
              <View className="border-border border-b">
                <View className="px-5 pt-4 pb-2">
                  <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    What to send
                  </Text>
                </View>
                {attendeeTypes.map((type) => (
                  <PreferenceTypeRow
                    key={type.type}
                    type={type}
                    onToggle={(channel, enabled) =>
                      update.mutate({ type: type.type, channel, enabled })
                    }
                  />
                ))}
              </View>

              <View>
                <View className="px-5 pt-4 pb-2">
                  <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    When to send
                  </Text>
                </View>
                <QuietHoursSection initial={data.quiet_hours} />
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
