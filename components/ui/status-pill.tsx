import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

export type StatusPillTone = 'primary' | 'success' | 'destructive' | 'muted';
export type StatusPillSize = 'sm' | 'md';

type Props = {
  label: string;
  tone: StatusPillTone;
  size?: StatusPillSize;
};

const TONES: Record<StatusPillTone, { container: string; text: string }> = {
  primary: { container: 'bg-primary/10', text: 'text-primary' },
  success: {
    container: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  destructive: { container: 'bg-destructive/10', text: 'text-destructive' },
  muted: { container: 'bg-muted', text: 'text-muted-foreground' },
};

const SIZES: Record<StatusPillSize, { container: string; text: string }> = {
  sm: {
    container: 'px-2 py-px',
    text: 'text-[10px] font-semibold uppercase tracking-wider',
  },
  md: {
    container: 'px-2 py-0.5',
    text: 'text-xs font-semibold',
  },
};

export function StatusPill({ label, tone, size = 'md' }: Props) {
  const t = TONES[tone];
  const s = SIZES[size];

  return (
    <View className={cn('rounded-full', t.container, s.container)}>
      <Text className={cn(t.text, s.text)}>{label}</Text>
    </View>
  );
}
