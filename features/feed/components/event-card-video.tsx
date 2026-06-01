import { Icon } from '@/components/ui/icon';
import { useFlyerVideoPlayer } from '@/features/feed/hooks';
import { VideoView } from 'expo-video';
import { Volume2, VolumeX } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type EventCardVideoProps = {
  url: string;
  isVisible: boolean;
};

export function EventCardVideo({ url, isVisible }: EventCardVideoProps) {
  const { player, muted, toggleMuted } = useFlyerVideoPlayer(url, isVisible);

  return (
    <Pressable onPress={toggleMuted} className="flex-1">
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
      <View className="absolute right-3 bottom-3 size-9 items-center justify-center rounded-full bg-black/55">
        <Icon as={muted ? VolumeX : Volume2} className="size-4 text-white" strokeWidth={2.25} />
      </View>
    </Pressable>
  );
}
