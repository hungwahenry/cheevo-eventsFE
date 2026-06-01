import * as React from 'react';
import { View } from 'react-native';

export function ActionBarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-background pb-safe-offset-3 border-border absolute right-0 bottom-0 left-0 border-t">
      <View className="flex-row items-center gap-3 px-5 pt-3">{children}</View>
    </View>
  );
}
