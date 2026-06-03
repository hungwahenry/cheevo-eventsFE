import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import * as api from '@/features/system/api';
import { configKey, flagsKey } from '@/features/system/hooks';
import { queryClient } from '@/lib/query';

export function useSystemBootstrap(): void {
  useEffect(() => {
    void queryClient.prefetchQuery({ queryKey: flagsKey(), queryFn: api.fetchFlags });
    void queryClient.prefetchQuery({ queryKey: configKey(), queryFn: api.fetchConfig });

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void queryClient.refetchQueries({ queryKey: flagsKey() });
        void queryClient.refetchQueries({ queryKey: configKey() });
      }
    });
    return () => sub.remove();
  }, []);
}
