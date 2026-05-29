import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

type LocationPromptProps = {
  status: 'idle' | 'loading' | 'denied';
  hasLocation: boolean;
  placeName: string | null;
  onRequest: () => void;
};

export function LocationPrompt({ status, hasLocation, placeName, onRequest }: LocationPromptProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5">
      <View className="bg-muted size-24 items-center justify-center rounded-full">
        <Icon as={MapPin} className="text-primary size-10" strokeWidth={1.5} />
      </View>

      {hasLocation ? (
        <Text className="text-foreground text-lg font-semibold">{placeName}</Text>
      ) : null}

      <Button
        variant={hasLocation ? 'outline' : 'default'}
        onPress={onRequest}
        disabled={status === 'loading'}>
        {status === 'loading' ? (
          <ActivityIndicator
            colorClassName={hasLocation ? 'accent-foreground' : 'accent-primary-foreground'}
          />
        ) : (
          <Text>{hasLocation ? 'Update location' : 'Set Up Location'}</Text>
        )}
      </Button>

      {status === 'denied' ? (
        <Text className="text-destructive px-6 text-center text-sm">
          Location permission is required to continue. Enable it in Settings, then try again.
        </Text>
      ) : null}
    </View>
  );
}
