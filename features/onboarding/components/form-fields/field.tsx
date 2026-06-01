import { Text } from '@/components/ui/text';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type FieldProps = {
  label?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-muted-foreground ml-1 text-sm font-medium">{label}</Text>
      ) : null}
      {children}
      {error ? <Text className="text-destructive ml-1 text-xs">{error}</Text> : null}
    </View>
  );
}
