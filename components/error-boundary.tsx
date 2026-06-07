import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Sentry from '@sentry/react-native';
import { TriangleAlert } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';

type Props = {
  error: Error;
  retry: () => void;
};

export function AppErrorBoundary({ error, retry }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <View className="bg-muted/40 items-center gap-3 rounded-2xl p-8">
        <View className="bg-destructive/10 size-16 items-center justify-center rounded-full">
          <Icon as={TriangleAlert} className="text-destructive size-8" strokeWidth={2} />
        </View>
        <Text className="text-foreground text-center text-xl font-sans-semibold">
          Something went wrong
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          The app hit an unexpected error. We&apos;ve logged it on our end. Try again — if it keeps
          happening, please reach out.
        </Text>
      </View>

      <View className="mt-6 w-full max-w-xs">
        <Button size="lg" className="w-full" onPress={retry}>
          <Text>Try again</Text>
        </Button>
      </View>
    </View>
  );
}
