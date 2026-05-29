import { router } from 'expo-router';
import { useLogout } from './use-auth-mutations';

export function useSignOut() {
  const logout = useLogout();
  const signOut = () => logout.mutate(undefined, { onSuccess: () => router.replace('/') });

  return { signOut, isPending: logout.isPending };
}
