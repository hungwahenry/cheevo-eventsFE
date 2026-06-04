import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useWelcomeContent } from '@/features/welcome/hooks';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { View } from 'react-native';

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format&fit=crop';
const FALLBACK_HEADLINE = 'Events\nlive here.';
const FALLBACK_SUBHEADLINE =
  "Find what's on, grab your tickets, and talk to everyone going.";

export default function WelcomeScreen() {
  const { data } = useWelcomeContent();

  const bg = data?.background_url ?? FALLBACK_BG;
  const headline = data?.headline ?? FALLBACK_HEADLINE;
  const subheadline = data?.subheadline ?? FALLBACK_SUBHEADLINE;

  return (
    <View className="bg-background flex-1">
      <Image
        source={{ uri: bg }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
        transition={200}
      />

      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.35]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '60%',
        }}
      />

      <View className="pb-safe-offset-6 mt-auto gap-6 px-6 pt-6">
        <View className="gap-3">
          <Text className="text-5xl font-extrabold tracking-tight text-white">
            {headline}
          </Text>
          <Text className="text-base leading-6 text-white/80">
            {subheadline}
          </Text>
        </View>

        <Button size="lg" className="w-full" onPress={() => router.push('/email')}>
          <Text>Get Started</Text>
        </Button>
      </View>
    </View>
  );
}
