import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/features/auth';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const { status, user } = useSession();

  if (status === 'loading') {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Spinner size="lg" />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/welcome" />;
  }

  if (user && !user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
