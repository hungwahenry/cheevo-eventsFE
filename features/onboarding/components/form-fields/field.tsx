import { Text } from '@/components/ui/text';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type FieldProps = {
  label?: string;
  children: ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-muted-foreground ml-1 text-sm font-sans-medium">{label}</Text>
      ) : null}
      {children}
    </View>
  );
}
