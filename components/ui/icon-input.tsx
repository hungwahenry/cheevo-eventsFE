import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { useUniwind } from 'uniwind';

type IconInputProps = React.ComponentProps<typeof TextInput> & {
  icon?: LucideIcon;
  trailing?: React.ReactNode;
  containerClassName?: string;
};

function IconInput({
  icon,
  trailing,
  className,
  containerClassName,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...props
}: IconInputProps) {
  const [focused, setFocused] = React.useState(false);
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <View
      className={cn(
        'bg-background h-14 flex-row items-center gap-3 rounded-full border px-5',
        focused ? 'border-primary' : 'border-input',
        containerClassName
      )}>
      {icon ? (
        <Icon
          as={icon}
          className={cn('size-5', focused ? 'text-primary' : 'text-muted-foreground')}
          strokeWidth={1.75}
        />
      ) : null}
      <TextInput
        className={cn(
          'text-foreground h-full flex-1 text-[16px]',
          className
        )}
        style={{ textAlignVertical: 'center', includeFontPadding: false, letterSpacing: 0 }}
        placeholderTextColor={placeholderTextColor ?? palette.mutedForeground}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
      {trailing}
    </View>
  );
}

export { IconInput };
