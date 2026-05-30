import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Check, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

type LocationPromptProps = {
  status: 'idle' | 'loading' | 'denied';
  hasLocation: boolean;
  placeName: string | null;
  onRequest: () => void;
};

export function LocationPrompt({ status, hasLocation, placeName, onRequest }: LocationPromptProps) {
  return (
    <View className="gap-4">
      {hasLocation ? (
        <View className="border-border bg-muted/40 flex-row items-center gap-3 rounded-2xl border p-4">
          <Icon as={MapPin} className="text-primary size-5" strokeWidth={1.75} />
          <Text className="text-foreground flex-1 font-medium">{placeName}</Text>
          <Icon as={Check} className="text-primary size-5" strokeWidth={2} />
        </View>
      ) : null}

      <Button
        variant={hasLocation ? 'outline' : 'default'}
        size="lg"
        className="w-full"
        onPress={onRequest}
        disabled={status === 'loading'}>
        {status === 'loading' ? (
          <Spinner
            size="sm"
            barClassName={hasLocation ? 'bg-foreground' : 'bg-primary-foreground'}
          />
        ) : (
          <Text>{hasLocation ? 'Update location' : 'Set up location'}</Text>
        )}
      </Button>

      {status === 'denied' ? (
        <Text className="text-destructive text-sm">
          Location permission is required to continue. Enable it in Settings, then try again.
        </Text>
      ) : null}
    </View>
  );
}
