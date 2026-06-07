import { EmptyState } from '@/components/ui/empty-state';
import { router, Stack } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="bg-background flex-1 justify-center">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="We couldn't find that screen. It may have moved."
          action={{ label: 'Go home', onPress: () => router.replace('/') }}
        />
      </View>
    </>
  );
}
