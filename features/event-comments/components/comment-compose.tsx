import { GifPicker, type GifPickerRef } from '@/components/gif-picker';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCreateComment } from '@/features/event-comments/hooks';
import type { CommentGif, EventComment } from '@/features/event-comments/types';
import { isApiError } from '@/lib/api';
import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { ImagePlay, Send, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner-native';
import { useUniwind } from 'uniwind';

type CommentComposeProps = {
  eventId: string;
  replyTarget: EventComment | null;
  onCancelReply: () => void;
  onSent: () => void;
};

const MAX_BODY = 500;

export function CommentCompose({
  eventId,
  replyTarget,
  onCancelReply,
  onSent,
}: CommentComposeProps) {
  const [body, setBody] = React.useState('');
  const [gif, setGif] = React.useState<CommentGif | null>(null);
  const [inputKey, setInputKey] = React.useState(0);
  const inputRef = React.useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
  const gifPickerRef = React.useRef<GifPickerRef>(null);
  const create = useCreateComment(eventId);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  React.useEffect(() => {
    if (replyTarget) {
      const mention = replyTarget.author.username
        ? `@${replyTarget.author.username} `
        : '';
      setBody((prev) => (prev.startsWith(mention) ? prev : mention));
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [replyTarget]);

  const canSend = (body.trim().length > 0 || gif !== null) && !create.isPending;

  const handleSend = () => {
    if (!canSend) return;
    haptics.success();

    create.mutate(
      {
        body: body.trim() || undefined,
        gif: gif ?? undefined,
        parent_id: replyTarget?.id,
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
  };

  return (
    <View className="border-border border-t">
      {replyTarget ? (
        <View className="bg-muted/60 flex-row items-center justify-between px-4 py-2">
          <Text className="text-muted-foreground text-xs">
            Replying to{' '}
            <Text className="text-foreground text-xs font-medium">
              {replyTarget.author.username
                ? `@${replyTarget.author.username}`
                : (replyTarget.author.display_name ?? 'comment')}
            </Text>
          </Text>
          <Pressable onPress={onCancelReply} hitSlop={8}>
            <Icon as={X} className="text-muted-foreground size-4" />
          </Pressable>
        </View>
      ) : null}

      {gif ? (
        <View className="px-4 pt-3">
          <View
            className="bg-muted relative overflow-hidden rounded-xl"
            style={{ width: 80, aspectRatio: gif.height > 0 ? gif.width / gif.height : 1 }}>
            <Image
              source={{ uri: gif.url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            <Pressable
              onPress={() => setGif(null)}
              hitSlop={8}
              className="bg-foreground/80 absolute top-1 right-1 size-5 items-center justify-center rounded-full">
              <Icon as={X} className="text-background size-3" />
            </Pressable>
          </View>
        </View>
      ) : null}

      <View className="flex-row items-end gap-2 px-2 pt-2 pb-safe">
        <Pressable
          onPress={() => gifPickerRef.current?.present()}
          hitSlop={8}
          className="size-9 items-center justify-center">
          <Icon as={ImagePlay} className="text-muted-foreground size-5" />
        </Pressable>

        <View className="bg-muted min-h-9 flex-1 justify-center rounded-2xl px-4 py-2">
          <BottomSheetTextInput
            key={inputKey}
            ref={inputRef}
            value={body}
            onChangeText={(t) => setBody(t.slice(0, MAX_BODY))}
            placeholder="Add a comment"
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={{
              color: colors.foreground,
              fontSize: 15,
              lineHeight: 20,
              paddingVertical: 0,
              maxHeight: 120,
            }}
          />
        </View>

        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          hitSlop={8}
          className={`size-9 items-center justify-center rounded-full ${
            canSend ? 'bg-primary' : 'bg-muted'
          }`}>
          {create.isPending ? (
            <Spinner size="sm" barClassName="bg-primary-foreground" />
          ) : (
            <Icon
              as={Send}
              className={canSend ? 'text-primary-foreground size-4' : 'text-muted-foreground size-4'}
              strokeWidth={2.25}
            />
          )}
        </Pressable>
      </View>

      <GifPicker ref={gifPickerRef} onSelect={setGif} />
    </View>
  );
}
