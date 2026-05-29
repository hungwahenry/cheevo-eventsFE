import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AuthLayout } from '@/features/auth';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <AuthLayout
      title="Find your people, find your night."
      subtitle="Discover parties, concerts and events near you — and see who's going."
      media={
        <Text className="text-primary text-6xl font-extrabold tracking-tighter lowercase">
          cheevo
        </Text>
      }
      footer={
        <Button size="lg" className="w-full" onPress={() => router.push('/email')}>
          <Text>Get Started</Text>
          <Icon as={ArrowRight} className="text-primary-foreground size-5" strokeWidth={2} />
        </Button>
      }
    />
  );
}
