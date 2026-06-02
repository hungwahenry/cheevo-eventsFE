import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useToggleSubscribe } from '@/features/organisations/hooks';
import type { PublicOrganisation } from '@/features/organisations/types';

type Props = {
  organisation: PublicOrganisation;
  size?: 'sm' | 'default';
};

export function OrgFollowButton({ organisation, size = 'default' }: Props) {
  const toggle = useToggleSubscribe(organisation.slug);
  const isFollowing = organisation.is_subscribed;

  return (
    <Button
      size={size}
      variant={isFollowing ? 'outline' : 'default'}
      disabled={toggle.isPending}
      onPress={() =>
        toggle.mutate({
          orgId: organisation.id,
          currentlySubscribed: isFollowing,
        })
      }>
      <Text>{isFollowing ? 'Following' : 'Follow'}</Text>
    </Button>
  );
}
