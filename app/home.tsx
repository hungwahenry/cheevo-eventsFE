import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCurrentUser, useSignOut } from '@/features/auth';
import { View } from 'react-native';

export default function HomeScreen() {
  const user = useCurrentUser();
  const { signOut, isPending } = useSignOut();

  return (
    <View className="bg-background pt-safe pb-safe flex-1 items-center justify-center gap-8 px-6">
      <View className="items-center gap-2">
        <Text className="text-foreground text-2xl font-bold">You're in</Text>
        <Text className="text-muted-foreground">{user?.email}</Text>
        <Text className="text-muted-foreground text-sm">
          {user?.onboarding_completed ? 'Onboarding complete' : 'Next stop: onboarding'}
        </Text>
      </View>

      <Button variant="outline" className="w-full" disabled={isPending} onPress={signOut}>
        <Text>Log out</Text>
      </Button>
    </View>
  );
}
