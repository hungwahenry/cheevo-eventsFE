import { useCurrentUser } from '@/features/auth';
import { useUnreadCount } from '@/features/notifications/hooks';
import { THEME } from '@/lib/theme';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Bell, House, Ticket, UserRound } from 'lucide-react-native';
import { Text, View } from 'react-native';
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
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={2} />,
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
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => (
            <InboxTabIcon color={color} size={size} />
          ),
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

function InboxTabIcon({ color, size }: { color: string; size: number }) {
  const { data } = useUnreadCount();
  const unread = data?.unread ?? 0;

  return (
    <View>
      <Bell color={color} size={size} strokeWidth={2} />
      {unread > 0 ? (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -6,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 8,
            backgroundColor: '#ef4444',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
            {unread > 99 ? '99+' : unread}
          </Text>
        </View>
      ) : null}
    </View>
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
