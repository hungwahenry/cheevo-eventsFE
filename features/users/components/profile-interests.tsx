import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useUserInterests } from '@/features/users/hooks';
import { View } from 'react-native';

type Props = {
  userId: string;
};

export function ProfileInterests({ userId }: Props) {
  const { data, isLoading } = useUserInterests(userId);

  if (isLoading) {
    return (
      <View className="gap-2 px-5 pb-3">
        <SectionTitle>Interests</SectionTitle>
        <View className="flex-row flex-wrap gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-14 rounded-full" />
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <View className="gap-2 px-5 pb-3">
      <SectionTitle>Interests</SectionTitle>
      <View className="flex-row flex-wrap gap-1.5">
        {data.map((interest) => (
          <View key={interest.id} className="bg-muted rounded-full px-3 py-1.5">
            <Text className="text-foreground text-xs font-sans-medium">{interest.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-muted-foreground text-xs font-sans-semibold tracking-wide uppercase">
      {children}
    </Text>
  );
}
