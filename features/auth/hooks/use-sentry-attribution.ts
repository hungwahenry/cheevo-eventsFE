import { useSessionStore } from '@/features/auth/stores';
import type { User } from '@/features/auth/types';
import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';

function apply(user: User | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.profile.username ?? undefined,
    });
  } else {
    Sentry.setUser(null);
  }
}

export function useSentryAttribution() {
  useEffect(() => {
    apply(useSessionStore.getState().user);
    return useSessionStore.subscribe((state, prev) => {
      if (state.user !== prev.user) apply(state.user);
    });
  }, []);
}
