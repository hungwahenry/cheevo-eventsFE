import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import * as React from 'react';

type NetworkContext = {
  isOnline: boolean;
  hasEverBeenOnline: boolean;
  refresh: () => Promise<void>;
};

const Ctx = React.createContext<NetworkContext | null>(null);

function isStateOnline(state: NetInfoState | null): boolean {
  if (!state) return true;
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<NetInfoState | null>(null);
  const [hasEverBeenOnline, setHasEverBeenOnline] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(setState);
    NetInfo.fetch().then(setState);
    return () => unsubscribe();
  }, []);

  const isOnline = isStateOnline(state);

  React.useEffect(() => {
    if (state !== null && isStateOnline(state)) setHasEverBeenOnline(true);
  }, [state]);

  const refresh = React.useCallback(async () => {
    const next = await NetInfo.refresh();
    setState(next);
  }, []);

  const value = React.useMemo(
    () => ({ isOnline, hasEverBeenOnline, refresh }),
    [isOnline, hasEverBeenOnline, refresh]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNetwork(): NetworkContext {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
