import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { TextInput, View } from 'react-native';

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
  ...props
}: IconInputProps) {
  const [focused, setFocused] = React.useState(false);

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
          // font-size only (no line-height) so iOS vertically centers single-line text
          'text-foreground placeholder:text-muted-foreground h-full flex-1 text-[16px]',
          className
        )}
        style={{ textAlignVertical: 'center', includeFontPadding: false }}
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
