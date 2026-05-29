import { useSession } from '@/features/auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { status } = useSession();

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

  // TODO: when onboarding screens exist, redirect here to /onboarding
  // while the session user's onboarding_completed is false.
  return <Redirect href="/home" />;
}
