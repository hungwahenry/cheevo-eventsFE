import {
  getNotificationPreferences,
  updateNotificationPreferences,
  updateQuietHours,
  type NotificationPreferences,
  type PreferenceUpdate,
  type QuietHours,
} from '@/features/notifications/api';
import { isApiError } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const notificationPreferencesKey = ['notifications', 'preferences'] as const;

export function useNotificationPreferences() {
  return useQuery<NotificationPreferences>({
    queryKey: notificationPreferencesKey,
    queryFn: getNotificationPreferences,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: PreferenceUpdate) => updateNotificationPreferences([update]),
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: notificationPreferencesKey });
      const previous = queryClient.getQueryData<NotificationPreferences>(
        notificationPreferencesKey
      );

      if (previous) {
        queryClient.setQueryData<NotificationPreferences>(notificationPreferencesKey, {
          ...previous,
          types: previous.types.map((t) =>
            t.type === update.type
              ? {
                  ...t,
                  channels: t.channels.map((c) =>
                    c.channel === update.channel ? { ...c, enabled: update.enabled } : c
                  ),
                }
              : t
          ),
        });
      }

      return { previous };
    },
    onError: (error, _u, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationPreferencesKey, context.previous);
      }
      if (isApiError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Could not save preference.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationPreferencesKey });
    },
  });
}

export function useUpdateQuietHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quietHours: QuietHours) => updateQuietHours(quietHours),
    onSuccess: (data) => {
      queryClient.setQueryData(notificationPreferencesKey, data);
      toast.success('Quiet hours updated');
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Could not save quiet hours.');
      }
    },
  });
}
