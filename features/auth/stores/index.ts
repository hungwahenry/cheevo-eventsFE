import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { clearToken, getToken, setToken } from '@/lib/api';
import { getCurrentExpoPushToken } from '@/lib/notifications';
import * as authApi from '@/features/auth/api';
import { notificationsApi } from '@/features/notifications';
import type { User } from '@/features/auth/types';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

type SessionState = {
  status: SessionStatus;
  user: User | null;

  bootstrap: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => void;
  signOut: () => Promise<void>;
  forceUnauthenticated: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: 'loading',
  user: null,

  bootstrap: async () => {
    const token = await getToken();
    if (!token) {
      set({ status: 'unauthenticated', user: null });
      return;
    }
    try {
      const user = await authApi.me();
      set({ status: 'authenticated', user });
    } catch {
      await clearToken();
      set({ status: 'unauthenticated', user: null });
    }
  },

  setSession: async (token, user) => {
    await setToken(token);
    set({ status: 'authenticated', user });
  },

  setUser: (user) => set({ user }),

  signOut: async () => {
    try {
      const pushToken = await getCurrentExpoPushToken();
      if (pushToken) {
        await notificationsApi.unregisterPushToken(pushToken);
      }
    } catch {}

    try {
      await authApi.logout();
    } catch {}
    await clearToken();
    set({ status: 'unauthenticated', user: null });
  },

  forceUnauthenticated: () => set({ status: 'unauthenticated', user: null }),
}));

export const useSession = () =>
  useSessionStore(useShallow((state) => ({ status: state.status, user: state.user })));

export const useCurrentUser = () => useSessionStore((state) => state.user);
