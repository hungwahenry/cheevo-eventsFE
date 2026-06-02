import { useCurrentUser } from '@/features/auth';
import { useUnreadCount } from '@/features/notifications/hooks';
import { THEME } from '@/lib/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { Bell, House, Ticket, UserRound, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useUniwind } from 'uniwind';

type TabMeta = {
  name: string;
  label: string;
  icon: LucideIcon;
};

const TABS: Record<string, TabMeta> = {
  index: { name: 'index', label: 'Feed', icon: House },
  tickets: { name: 'tickets', label: 'Tickets', icon: Ticket },
  inbox: { name: 'inbox', label: 'Inbox', icon: Bell },
  profile: { name: 'profile', label: 'Profile', icon: UserRound },
};

export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.background,
        borderTopColor: palette.border,
        borderTopWidth: 1,
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingHorizontal: 8,
      }}>
      {state.routes.map((route, index) => {
        const meta = TABS[route.name];
        if (!meta) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabBarItem
            key={route.key}
            meta={meta}
            isFocused={isFocused}
            palette={palette}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

type ItemProps = {
  meta: TabMeta;
  isFocused: boolean;
  palette: (typeof THEME)['light'];
  onPress: () => void;
  onLongPress: () => void;
};

function TabBarItem({ meta, isFocused, palette, onPress, onLongPress }: ItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={meta.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flexGrow: isFocused ? 1 : 0,
        flexShrink: 0,
        flexBasis: 'auto',
        marginHorizontal: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: 40,
          paddingHorizontal: isFocused ? 16 : 12,
          borderRadius: 999,
          backgroundColor: isFocused ? palette.primary : 'transparent',
        }}>
        <TabBarIcon
          meta={meta}
          isFocused={isFocused}
          tintActive={palette.primaryForeground}
          tintInactive={palette.mutedForeground}
        />

        {isFocused ? (
          <Text
            numberOfLines={1}
            style={{
              color: palette.primaryForeground,
              fontSize: 13,
              fontWeight: '600',
            }}>
            {meta.label}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function TabBarIcon({
  meta,
  isFocused,
  tintActive,
  tintInactive,
}: {
  meta: TabMeta;
  isFocused: boolean;
  tintActive: string;
  tintInactive: string;
}) {
  const color = isFocused ? tintActive : tintInactive;

  if (meta.name === 'profile') {
    return <ProfileIcon color={color} />;
  }

  if (meta.name === 'inbox') {
    return <InboxIcon color={color} />;
  }

  const Icon = meta.icon;
  return <Icon color={color} size={22} strokeWidth={isFocused ? 2.4 : 2} />;
}

function InboxIcon({ color }: { color: string }) {
  const { data } = useUnreadCount();
  const unread = data?.unread ?? 0;

  return (
    <View>
      <Bell color={color} size={22} strokeWidth={2} />
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

function ProfileIcon({ color }: { color: string }) {
  const user = useCurrentUser();
  const avatarUrl = user?.profile.avatar_url;

  if (!avatarUrl) {
    return <UserRound color={color} size={22} strokeWidth={2} />;
  }

  const size = 24;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        padding: 1,
      }}>
      <Image
        source={{ uri: avatarUrl }}
        style={{ flex: 1, borderRadius: size / 2 }}
        contentFit="cover"
        transition={150}
      />
    </View>
  );
}
