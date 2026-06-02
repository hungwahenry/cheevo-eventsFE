import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PreferencesState = {
  hapticsEnabled: boolean;
  setHapticsEnabled: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
    }),
    {
      name: 'cheevo:preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useHapticsEnabled = () => usePreferencesStore((s) => s.hapticsEnabled);
export const useSetHapticsEnabled = () =>
  usePreferencesStore((s) => s.setHapticsEnabled);
