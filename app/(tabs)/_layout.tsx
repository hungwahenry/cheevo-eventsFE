import { TabBar } from '@/components/tab-bar';
import { useSession } from '@/features/auth';
import { Redirect, Tabs } from 'expo-router';

export default function TabsLayout() {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tickets" />
      <Tabs.Screen name="inbox" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
