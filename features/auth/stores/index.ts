import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { clearToken, getToken, setToken } from '@/lib/api';
import * as authApi from '@/features/auth/api';
import type { User } from '@/features/auth/types';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

type SessionState = {
  status: SessionStatus;
  user: User | null;

  /** App-launch: load the stored token and hydrate the session from /auth/me. */
  bootstrap: () => Promise<void>;
  /** After verify-otp: persist the token and mark the session authenticated. */
  setSession: (token: string, user: User) => Promise<void>;
  /** Refresh the cached user (e.g. after onboarding completes). */
  setUser: (user: User) => void;
  /** Explicit logout: revoke server-side (best effort) then clear locally. */
  signOut: () => Promise<void>;
  /** Local-only reset, used by the 401 handler (token already cleared). */
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
      await authApi.logout();
    } catch {
      // Ignore — we clear the local session regardless of the server response.
    }
    await clearToken();
    set({ status: 'unauthenticated', user: null });
  },

  forceUnauthenticated: () => set({ status: 'unauthenticated', user: null }),
}));

export const useSession = () =>
  useSessionStore(useShallow((state) => ({ status: state.status, user: state.user })));

export const useCurrentUser = () => useSessionStore((state) => state.user);
