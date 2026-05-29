import { Icon } from '@/components/ui/icon';
import { IconInput } from '@/components/ui/icon-input';
import { AtSign, Check, X } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

type UsernameStatus = {
  isChecking: boolean;
  available?: boolean;
};

type UsernameFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  status: UsernameStatus;
};

export function UsernameField({ value, onChangeText, onBlur, status }: UsernameFieldProps) {
  return (
    <IconInput
      icon={AtSign}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder="username"
      autoCapitalize="none"
      autoCorrect={false}
      trailing={
        status.isChecking ? (
          <ActivityIndicator />
        ) : status.available === true ? (
          <Icon as={Check} className="size-5 text-green-500" strokeWidth={2.25} />
        ) : status.available === false ? (
          <Icon as={X} className="text-destructive size-5" strokeWidth={2.25} />
        ) : null
      }
    />
  );
}
