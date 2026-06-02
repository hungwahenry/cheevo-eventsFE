import { api } from '@/lib/api';

export type BlockTargetType = 'user' | 'organisation';

export function createBlock(targetType: BlockTargetType, targetId: string): Promise<null> {
  return api.post<null>('/attendee/blocks', {
    target_type: targetType,
    target_id: targetId,
  });
}

export function deleteBlock(targetType: BlockTargetType, targetId: string): Promise<null> {
  return api.delete<null>(`/attendee/blocks/${targetType}/${targetId}`);
}
