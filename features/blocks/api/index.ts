import type {
  BlockTargetType,
  BlockedOrganisation,
  BlockedPage,
  BlockedUser,
} from '@/features/blocks/types';
import { api } from '@/lib/api';

export function createBlock(targetType: BlockTargetType, targetId: string): Promise<null> {
  return api.post<null>('/attendee/blocks', {
    target_type: targetType,
    target_id: targetId,
  });
}

export function deleteBlock(targetType: BlockTargetType, targetId: string): Promise<null> {
  return api.delete<null>(`/attendee/blocks/${targetType}/${targetId}`);
}

export function listBlockedUsers(page: number): Promise<BlockedPage<BlockedUser>> {
  return api.get<BlockedPage<BlockedUser>>('/attendee/blocks/users', {
    params: { page },
  });
}

export function listBlockedOrganisations(page: number): Promise<BlockedPage<BlockedOrganisation>> {
  return api.get<BlockedPage<BlockedOrganisation>>('/attendee/blocks/organisations', {
    params: { page },
  });
}
