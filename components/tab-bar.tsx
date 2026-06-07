import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/features/auth';
import { useUnreadCount } from '@/features/notifications/hooks';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { Bell, House, Ticket, UserRound, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Feed', icon: House },
  tickets: { label: 'Tickets', icon: Ticket },
  inbox: { label: 'Inbox', icon: Bell },
  profile: { label: 'Profile', icon: UserRound },
};

export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View
      className="bg-background border-border flex-row items-center justify-around border-t px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === i;

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
            <TabIcon route={route.name} icon={tab.icon} focused={focused} />
            {focused ? (
              <Text className="text-primary-foreground text-sm font-sans-semibold">{tab.label}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function tintClass(focused: boolean): string {
  return focused ? 'text-primary-foreground' : 'text-muted-foreground';
}

function TabIcon({
  route,
  icon,
  focused,
}: {
  route: string;
  icon: LucideIcon;
  focused: boolean;
}) {
  if (route === 'profile') return <ProfileAvatar fallback={icon} focused={focused} />;
  if (route === 'inbox') return <InboxBell focused={focused} />;
  return <Icon as={icon} className={tintClass(focused)} size={22} strokeWidth={2} />;
}

function InboxBell({ focused }: { focused: boolean }) {
  const { data } = useUnreadCount();
  const unread = data?.unread ?? 0;

  return (
    <View>
      <Icon as={Bell} className={tintClass(focused)} size={22} strokeWidth={2} />
      {unread > 0 ? (
        <View className="absolute -top-1 -right-1.5 h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1">
          <Text className="text-[10px] font-sans-bold text-white">{unread > 99 ? '99+' : unread}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ProfileAvatar({
  fallback,
  focused,
}: {
  fallback: LucideIcon;
  focused: boolean;
}) {
  const avatarUrl = useCurrentUser()?.profile.avatar_url;
  if (!avatarUrl) {
    return <Icon as={fallback} className={tintClass(focused)} size={22} strokeWidth={2} />;
  }

  const ringClass = focused ? 'border-primary-foreground' : 'border-muted-foreground';

  return (
    <View className={`size-6 rounded-full border p-px ${ringClass}`}>
      <Image
        source={{ uri: avatarUrl }}
        style={{ flex: 1, borderRadius: 12 }}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
}
