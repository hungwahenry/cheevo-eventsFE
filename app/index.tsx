import { useSession } from '@/features/auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { status, user } = useSession();

  if (status === 'loading') {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator size="large" colorClassName="accent-primary" />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/welcome" />;
  }

  if (user && !user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}
