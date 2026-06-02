import { Icon } from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
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

export function ProfileTabs({ userId, viewpoint }: Props) {
  const [value, setValue] = useState<TabKey>('attended');

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as TabKey)} className="px-5">
      <TabsList className="h-10 w-full">
        <TabsTrigger value="attended" className="flex-1">
          <Icon as={HistoryIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>Past events</Text>
        </TabsTrigger>
        <TabsTrigger value="comments" className="flex-1">
          <Icon as={MessageCircleIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>Comments</Text>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex-1">
          <Icon as={HeartIcon} className="text-foreground size-4" strokeWidth={2.25} />
          <Text>Following</Text>
        </TabsTrigger>
      </TabsList>

      <View className="pt-1">
        <TabsContent value="attended">
          <ProfileAttendedEvents userId={userId} viewpoint={viewpoint} />
        </TabsContent>
        <TabsContent value="comments">
          <ProfileComments userId={userId} viewpoint={viewpoint} />
        </TabsContent>
        <TabsContent value="following">
          <ProfileOrganisations userId={userId} viewpoint={viewpoint} />
        </TabsContent>
      </View>
    </Tabs>
  );
}
