import { api } from '@/lib/api';

import type { WelcomeContent } from '@/features/welcome/types';

export function fetchWelcomeContent(): Promise<WelcomeContent> {
  return api.get<WelcomeContent>('/welcome');
}
