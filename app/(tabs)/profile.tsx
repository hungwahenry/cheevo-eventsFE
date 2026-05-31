import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCurrentUser, useSignOut } from '@/features/auth';
import { View } from 'react-native';

export default function ProfileScreen() {
  const user = useCurrentUser();
  const { signOut, isPending } = useSignOut();

  return (
    <Screen title="Profile" subtitle={user?.email}>
      <View className="mt-auto px-5 pb-4">
        <Button variant="outline" className="w-full" disabled={isPending} onPress={signOut}>
          <Text>Log out</Text>
        </Button>
      </View>
    </Screen>
  );
}
