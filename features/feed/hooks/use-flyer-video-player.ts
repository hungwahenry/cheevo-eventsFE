import { useEvent } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useCallback, useEffect } from 'react';

export function useFlyerVideoPlayer(url: string, isVisible: boolean) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.muted = true;
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
