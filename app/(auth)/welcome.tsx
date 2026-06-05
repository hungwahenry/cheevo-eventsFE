import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useWelcomeContent } from '@/features/welcome/hooks';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function WelcomeScreen() {
  const { data } = useWelcomeContent();

  return (
    <View className="bg-background flex-1">
      {data?.background_url ? (
        <Image
          source={{ uri: data.background_url }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
          transition={200}
        />
      ) : null}

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
          {data?.headline ? (
            <Text className="text-5xl font-extrabold tracking-tight text-white">
              {data.headline}
            </Text>
          ) : null}
          {data?.subheadline ? (
            <Text className="text-base leading-6 text-white/80">
              {data.subheadline}
            </Text>
          ) : null}
        </View>

        <Button size="lg" className="w-full" onPress={() => router.push('/email')}>
          <Text>Get Started</Text>
        </Button>
      </View>
    </View>
  );
}
