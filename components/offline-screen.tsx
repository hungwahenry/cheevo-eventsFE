import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useNetwork } from '@/lib/network';
import { WifiOff } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function OfflineScreen() {
  const { refresh } = useNetwork();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const onRetry = React.useCallback(async () => {
    setIsRetrying(true);
    try {
      await refresh();
    } finally {
      setIsRetrying(false);
    }
  }, [refresh]);

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <View className="bg-muted/40 items-center gap-3 rounded-2xl p-8">
        <View className="bg-destructive/10 size-16 items-center justify-center rounded-full">
          <Icon as={WifiOff} className="text-destructive size-8" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-sans-semibold">
          No Internet Connection
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          cheevo needs an internet connection. Check your Wi-Fi or cellular data and try again.
        </Text>
      </View>

      <View className="mt-6 w-full max-w-xs">
        <Button size="lg" className="w-full" disabled={isRetrying} onPress={onRetry}>
          {isRetrying ? (
            <Spinner size="sm" barClassName="bg-primary-foreground" />
          ) : (
            <Text>Try again</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
