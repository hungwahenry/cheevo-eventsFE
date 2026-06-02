import { UnderlinedTabs, type UnderlinedTab } from '@/components/ui/underlined-tabs';
import { ProfileAttendedEvents } from '@/features/users/components/profile-attended-events';
import { ProfileComments } from '@/features/users/components/profile-comments';
import { ProfileOrganisations } from '@/features/users/components/profile-organisations';
import { HeartIcon, HistoryIcon, MessageCircleIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

export type ProfileViewpoint = 'self' | 'other';

type Props = {
  userId: string;
  viewpoint: ProfileViewpoint;
};

type TabKey = 'attended' | 'comments' | 'following';

const TABS: UnderlinedTab<TabKey>[] = [
  { value: 'attended', label: 'Past events', icon: HistoryIcon },
  { value: 'comments', label: 'Comments', icon: MessageCircleIcon },
  { value: 'following', label: 'Following', icon: HeartIcon },
];

export function ProfileTabs({ userId, viewpoint }: Props) {
  const [value, setValue] = useState<TabKey>('attended');

  return (
    <View>
      <UnderlinedTabs tabs={TABS} value={value} onValueChange={setValue} />

      <View className="px-5 pt-2">
        {value === 'attended' ? (
          <ProfileAttendedEvents userId={userId} viewpoint={viewpoint} />
        ) : null}
        {value === 'comments' ? (
          <ProfileComments userId={userId} viewpoint={viewpoint} />
        ) : null}
        {value === 'following' ? (
          <ProfileOrganisations userId={userId} viewpoint={viewpoint} />
        ) : null}
      </View>
    </View>
  );
}
