import { useCurrentUser } from '@/features/auth';
import { THEME } from '@/lib/theme';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Compass, House, Ticket, UserRound } from 'lucide-react-native';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';

export default function TabsLayout() {
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.mutedForeground,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <ProfileTabIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function ProfileTabIcon({
  focused,
  color,
  size,
}: {
  focused: boolean;
  color: string;
  size: number;
}) {
  const user = useCurrentUser();
  const avatarUrl = user?.profile.avatar_url;

  if (!avatarUrl) {
    return <UserRound color={color} size={size} strokeWidth={2} />;
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: focused ? color : 'transparent',
        overflow: 'hidden',
      }}>
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
}
