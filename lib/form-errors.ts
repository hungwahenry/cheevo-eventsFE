import type { FieldErrors, FieldValues } from 'react-hook-form';

export function firstErrorMessage<T extends FieldValues>(errors: FieldErrors<T>): string | null {
  for (const value of Object.values(errors)) {
    if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
      return value.message;
    }
  }
  return null;
}
