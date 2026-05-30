import { useCreateComment } from '@/features/event-comments/hooks/use-create-comment';
import type { ReplyTarget } from '@/features/event-comments/types';
import { isApiError } from '@/lib/api';
import type { PickedGif } from '@/lib/giphy';
import { haptics } from '@/lib/haptics';
import * as React from 'react';
import { toast } from 'sonner-native';

const MAX_BODY = 500;

export function useCommentCompose({
  eventId,
  replyTarget,
  onSent,
}: {
  eventId: string;
  replyTarget: ReplyTarget | null;
  onSent: () => void;
}) {
  const [body, setBody] = React.useState('');
  const [gif, setGif] = React.useState<PickedGif | null>(null);
  const [inputKey, setInputKey] = React.useState(0);
  const create = useCreateComment(eventId);

  const setBodyBounded = React.useCallback(
    (text: string) => setBody(text.slice(0, MAX_BODY)),
    []
  );

  const canSend = (body.trim().length > 0 || gif !== null) && !create.isPending;

  const send = React.useCallback(() => {
    if (!canSend) return;
    haptics.success();

    create.mutate(
      {
        body: body.trim() || undefined,
        gif: gif ?? undefined,
        parent_id: replyTarget?.parentId,
        mentions: replyTarget ? [replyTarget.mentionedUserId] : undefined,
      },
      {
        onSuccess: () => {
          setBody('');
          setGif(null);
          setInputKey((k) => k + 1);
          onSent();
        },
        onError: (error) => {
          if (isApiError(error) && error.isValidation) {
            const first = Object.values(error.fieldErrors())[0];
            toast.error(first ?? error.message);
          }
        },
      }
    );
  }, [body, gif, canSend, create, replyTarget, onSent]);

  return {
    body,
    setBody: setBodyBounded,
    gif,
    setGif,
    inputKey,
    canSend,
    isPending: create.isPending,
    send,
    maxBody: MAX_BODY,
  };
}
