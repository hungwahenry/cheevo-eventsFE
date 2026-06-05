import { focusManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';

export function bindReactQueryFocusToAppState() {
  const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
    focusManager.setFocused(state === 'active');
  });
  return () => sub.remove();
}
