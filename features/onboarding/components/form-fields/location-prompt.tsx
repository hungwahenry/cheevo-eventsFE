import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Check, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

type LocationPromptProps = {
  status: 'idle' | 'loading';
  hasLocation: boolean;
  placeName: string | null;
  onRequest: () => void;
};

export function LocationPrompt({ status, hasLocation, placeName, onRequest }: LocationPromptProps) {
  return (
    <View className="gap-4">
      {hasLocation ? (
        <View className="bg-muted/40 flex-row items-center gap-3 rounded-2xl p-4">
          <Icon as={MapPin} className="text-primary size-5" strokeWidth={1.75} />
          <Text className="text-foreground flex-1 font-sans-medium">{placeName}</Text>
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
    </View>
  );
}
