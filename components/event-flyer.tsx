import { Icon } from '@/components/ui/icon';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  flyerUrl: string | null;
  flyerType: 'image' | 'video' | null;
  /** `play` autoplays the video and shows a mute toggle; `thumbnail` shows a paused first frame. */
  variant?: 'play' | 'thumbnail';
  /** Pauses the video when offscreen. Only used when variant is `play`. */
  isVisible?: boolean;
};

export function EventFlyer({
  flyerUrl,
  flyerType,
  variant = 'play',
  isVisible = true,
}: Props) {
  if (!flyerUrl) return null;

  if (flyerType === 'video') {
    return variant === 'play' ? (
      <FlyerVideoPlayer url={flyerUrl} isVisible={isVisible} />
    ) : (
      <FlyerVideoThumbnail url={flyerUrl} />
    );
  }

  return (
    <Image
      source={{ uri: flyerUrl }}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      transition={150}
    />
  );
}

function FlyerVideoPlayer({ url, isVisible }: { url: string; isVisible: boolean }) {
  const { player, muted, toggleMuted } = useAutoplayVideo(url, isVisible);

  return (
    <Pressable onPress={toggleMuted} className="size-full">
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
      <View className="absolute right-3 bottom-3 size-9 items-center justify-center rounded-full bg-black/55">
        <Icon
          as={muted ? VolumeX : Volume2}
          className="size-4 text-white"
          strokeWidth={2.25}
        />
      </View>
    </Pressable>
  );
}

function FlyerVideoThumbnail({ url }: { url: string }) {
  const source = useMemo(() => ({ uri: url, useCaching: true }), [url]);
  const player = useVideoPlayer(source, (p) => {
    p.muted = true;
  });

  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
    />
  );
}

function useAutoplayVideo(url: string, isVisible: boolean) {
  const source = useMemo(() => ({ uri: url, useCaching: true }), [url]);
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.bufferOptions = { preferredForwardBufferDuration: 30 };
  });

  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }, [isVisible, player]);

  const toggleMuted = useCallback(() => {
    player.muted = !player.muted;
  }, [player]);

  return { player, muted, toggleMuted };
}
