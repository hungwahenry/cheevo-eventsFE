import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export type CommentAction = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  onPress: () => void;
};

export type CommentActionsSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type CommentActionsSheetProps = {
  actions: CommentAction[];
};

export const CommentActionsSheet = React.forwardRef<
  CommentActionsSheetRef,
  CommentActionsSheetProps
>(function CommentActionsSheet({ actions }, forwardedRef) {
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
      stackBehavior="push"
      topInset={insets.top}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
      <BottomSheetView style={{ paddingBottom: insets.bottom + 8 }}>
        <View className="pt-1 pb-2">
          {actions.map((action, i) => (
            <ActionRow
              key={i}
              action={action}
              onAfterPress={() => ref.current?.dismiss()}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function ActionRow({
  action,
  onAfterPress,
}: {
  action: CommentAction;
  onAfterPress: () => void;
}) {
  const handlePress = () => {
    action.onPress();
    onAfterPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      className="flex-row items-center gap-3 px-5 py-3.5 active:opacity-70">
      <Icon
        as={action.icon}
        className={action.destructive ? 'text-destructive size-5' : 'text-foreground size-5'}
        strokeWidth={2}
      />
      <Text
        className={
          action.destructive
            ? 'text-destructive text-base font-medium'
            : 'text-foreground text-base'
        }>
        {action.label}
      </Text>
    </Pressable>
  );
}
