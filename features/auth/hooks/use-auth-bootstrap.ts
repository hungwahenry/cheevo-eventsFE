import { useSessionStore } from '@/features/auth/stores';
import { setUnauthorizedHandler } from '@/lib/api';
import { useEffect } from 'react';

export function useAuthBootstrap() {
  useEffect(() => {
    setUnauthorizedHandler(() => useSessionStore.getState().forceUnauthenticated());
    void useSessionStore.getState().bootstrap();

    return () => setUnauthorizedHandler(null);
  }, []);
}
