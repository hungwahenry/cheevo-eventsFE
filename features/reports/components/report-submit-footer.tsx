import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onSubmit: () => void;
  disabled: boolean;
  isPending: boolean;
};

export function ReportSubmitFooter({ onSubmit, disabled, isPending }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-border bg-background border-t px-5 pt-3"
      style={{ paddingBottom: insets.bottom + 12 }}>
      <Button onPress={onSubmit} disabled={disabled} className="w-full">
        <Text>{isPending ? 'Sending…' : 'Send report'}</Text>
      </Button>
    </View>
  );
}
