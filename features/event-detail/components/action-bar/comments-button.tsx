import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MessageCircle } from 'lucide-react-native';

export function CommentsButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Button variant="outline" className="gap-1.5 px-4" onPress={onPress}>
      <Icon as={MessageCircle} className="text-foreground size-4" strokeWidth={2.25} />
      {count > 0 ? <Text>{count.toLocaleString()}</Text> : null}
    </Button>
  );
}
