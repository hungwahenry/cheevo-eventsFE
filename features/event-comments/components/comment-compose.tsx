import { GifPicker, type GifPickerRef } from '@/components/gif-picker';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useCommentCompose } from '@/features/event-comments/hooks';
import type { ReplyTarget } from '@/features/event-comments/types';
import { THEME } from '@/lib/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { ImagePlay, Send, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useUniwind } from 'uniwind';

type CommentComposeProps = {
  eventId: string;
  replyTarget: ReplyTarget | null;
  onCancelReply: () => void;
  onSent: () => void;
};

export function CommentCompose({
  eventId,
  replyTarget,
  onCancelReply,
  onSent,
}: CommentComposeProps) {
  const compose = useCommentCompose({ eventId, replyTarget, onSent });
  const inputRef = React.useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
  const gifPickerRef = React.useRef<GifPickerRef>(null);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  React.useEffect(() => {
    if (replyTarget) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [replyTarget]);

  return (
    <View className="border-border border-t">
      {replyTarget ? (
        <ReplyPill target={replyTarget} onCancel={onCancelReply} />
      ) : null}

      {compose.gif ? (
        <GifPreview gif={compose.gif} onRemove={() => compose.setGif(null)} />
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
            key={compose.inputKey}
            ref={inputRef}
            value={compose.body}
            onChangeText={compose.setBody}
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
          onPress={compose.send}
          disabled={!compose.canSend}
          hitSlop={8}
          className={`size-9 items-center justify-center rounded-full ${
            compose.canSend ? 'bg-primary' : 'bg-muted'
          }`}>
          {compose.isPending ? (
            <Spinner size="sm" barClassName="bg-primary-foreground" />
          ) : (
            <Icon
              as={Send}
              className={compose.canSend ? 'text-primary-foreground size-4' : 'text-muted-foreground size-4'}
              strokeWidth={2.25}
            />
          )}
        </Pressable>
      </View>

      <GifPicker ref={gifPickerRef} onSelect={compose.setGif} />
    </View>
  );
}

function ReplyPill({
  target,
  onCancel,
}: {
  target: ReplyTarget;
  onCancel: () => void;
}) {
  const label = target.mentionUsername ? `@${target.mentionUsername}` : 'comment';

  return (
    <View className="bg-muted/60 flex-row items-center justify-between px-4 py-2">
      <Text className="text-muted-foreground text-xs">
        Replying to{' '}
        <Text className="text-foreground text-xs font-medium">{label}</Text>
      </Text>
      <Pressable onPress={onCancel} hitSlop={8}>
        <Icon as={X} className="text-muted-foreground size-4" />
      </Pressable>
    </View>
  );
}

function GifPreview({
  gif,
  onRemove,
}: {
  gif: { url: string; width: number; height: number };
  onRemove: () => void;
}) {
  const aspect = gif.height > 0 ? gif.width / gif.height : 1;

  return (
    <View className="px-4 pt-3">
      <View
        className="bg-muted relative overflow-hidden rounded-xl"
        style={{ width: 80, aspectRatio: aspect }}>
        <Image
          source={{ uri: gif.url }}
          className="size-full"
          contentFit="cover"
        />
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          className="bg-foreground/80 absolute top-1 right-1 size-5 items-center justify-center rounded-full">
          <Icon as={X} className="text-background size-3" />
        </Pressable>
      </View>
    </View>
  );
}
