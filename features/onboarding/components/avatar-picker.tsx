import { Icon } from '@/components/ui/icon';
import { dicebearAvatarUrl } from '@/lib/avatar';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type AvatarPickerProps = {
  /** A chosen photo (takes priority). */
  uri: string | null;
  /** Username seed — previews the DiceBear default avatar live while typing. */
  seed?: string;
  onPress: () => void;
  size?: number;
};

export function AvatarPicker({ uri, seed, onPress, size = 56 }: AvatarPickerProps) {
  const source = uri ? { uri } : seed ? { uri: dicebearAvatarUrl(seed) } : null;

  return (
    <Pressable onPress={onPress} style={{ width: size, height: size }}>
      {source ? (
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View
          style={{ width: size, height: size }}
          className="bg-muted items-center justify-center rounded-full">
          <Icon as={Camera} className="text-muted-foreground size-5" strokeWidth={1.75} />
        </View>
      )}
      <View className="border-background bg-primary absolute -right-0.5 -bottom-0.5 size-5 items-center justify-center rounded-full border-2">
        <Icon as={Camera} className="text-primary-foreground size-3" strokeWidth={2.25} />
      </View>
    </Pressable>
  );
}
