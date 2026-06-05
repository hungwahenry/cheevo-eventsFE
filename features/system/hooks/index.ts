import { useQuery } from '@tanstack/react-query';

import * as api from '@/features/system/api';
import { configKey, flagsKey } from '@/features/system/hooks/keys';
import type { ConfigKey, FeatureFlagKey } from '@/features/system/types';

export { configKey, flagsKey };

export function useFlags() {
  return useQuery({
    queryKey: flagsKey(),
    queryFn: () => api.fetchFlags(),
    staleTime: 5 * 60_000,
  });
}

export function useConfig() {
  return useQuery({
    queryKey: configKey(),
    queryFn: () => api.fetchConfig(),
    staleTime: 5 * 60_000,
  });
}

/**
 * Check a feature flag. Returns false while loading or for unknown keys (fail-safe-off).
 */
export function useFeature(key: FeatureFlagKey): boolean {
  const { data } = useFlags();
  return Boolean(data?.[key]);
}

/**
 * Read a typed config value. Returns the fallback while loading or for unknown keys.
 */
export function useConfigValue<T>(key: ConfigKey, fallback: T): T {
  const { data } = useConfig();
  const value = data?.[key];
  return value !== undefined ? (value as T) : fallback;
}

export { useSystemBootstrap } from '@/features/system/hooks/use-system-bootstrap';
