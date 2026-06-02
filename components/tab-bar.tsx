import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/features/auth';
import { useUnreadCount } from '@/features/notifications/hooks';
import { THEME } from '@/lib/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { Bell, House, Ticket, UserRound, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useUniwind } from 'uniwind';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Feed', icon: House },
  tickets: { label: 'Tickets', icon: Ticket },
  inbox: { label: 'Inbox', icon: Bell },
  profile: { label: 'Profile', icon: UserRound },
};

export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <View
      className="bg-background border-border flex-row items-center justify-around border-t px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === i;
        const color = focused ? palette.primaryForeground : palette.mutedForeground;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            className={`h-10 flex-row items-center justify-center gap-1.5 rounded-full px-3 ${
              focused ? 'bg-primary' : ''
            }`}>
            <TabIcon route={route.name} icon={tab.icon} color={color} />
            {focused ? (
              <Text className="text-primary-foreground text-sm font-semibold">{tab.label}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function TabIcon({ route, icon: Icon, color }: { route: string; icon: LucideIcon; color: string }) {
  if (route === 'profile') return <ProfileAvatar color={color} fallback={Icon} />;
  if (route === 'inbox') return <InboxBell color={color} />;
  return <Icon color={color} size={22} strokeWidth={2} />;
}

function InboxBell({ color }: { color: string }) {
  const { data } = useUnreadCount();
  const unread = data?.unread ?? 0;

  return (
    <View>
      <Bell color={color} size={22} strokeWidth={2} />
      {unread > 0 ? (
        <View className="absolute -top-1 -right-1.5 h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1">
          <Text className="text-[10px] font-bold text-white">{unread > 99 ? '99+' : unread}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ProfileAvatar({ color, fallback: Fallback }: { color: string; fallback: LucideIcon }) {
  const avatarUrl = useCurrentUser()?.profile.avatar_url;
  if (!avatarUrl) return <Fallback color={color} size={22} strokeWidth={2} />;

  return (
    <View
      className="size-6 rounded-full p-px"
      style={{ borderWidth: 1.5, borderColor: color }}>
      <Image
        source={{ uri: avatarUrl }}
        style={{ flex: 1, borderRadius: 12 }}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
}
