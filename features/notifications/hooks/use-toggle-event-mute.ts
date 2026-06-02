import { toggleEventMute } from '@/features/notifications/api';
import { isApiError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export function useToggleEventMute(eventSlug: string, eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleEventMute(eventId),
    onSuccess: ({ muted }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventSlug] });
      toast.success(muted ? 'Event muted' : 'Event unmuted');
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Could not update mute setting.');
      }
    },
  });
}
