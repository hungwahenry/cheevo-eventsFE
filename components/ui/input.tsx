import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Platform, StyleSheet, TextInput, type TextStyle } from 'react-native';
import { useUniwind } from 'uniwind';

function Input({
  className,
  style,
  placeholderTextColor,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  const { theme } = useUniwind();
  const palette = THEME[theme ?? 'light'];

  return (
    <TextInput
      className={cn(
        'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-full border px-4 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground transition-[color,box-shadow] outline-none md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      placeholderTextColor={placeholderTextColor ?? palette.mutedForeground}
      style={StyleSheet.flatten([{ letterSpacing: 0 } as TextStyle, style])}
      {...props}
    />
  );
}

export { Input };
