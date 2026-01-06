import { useForm as useReactHookForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';

export interface UseFormOptions<T extends FieldValues> extends UseFormProps<T> {
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

export function useForm<T extends FieldValues = FieldValues>(
  options?: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    mode = 'onSubmit',
    reValidateMode = 'onChange',
    ...restOptions
  } = options || {};

  return useReactHookForm<T>({
    mode,
    reValidateMode,
    ...restOptions,
  });
}

