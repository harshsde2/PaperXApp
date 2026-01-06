import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';

export type FormProps<T extends FieldValues> = UseFormProps<T>;

export type FormReturn<T extends FieldValues> = UseFormReturn<T>;

export interface FormFieldError {
  message?: string;
  type?: string;
}

export interface FormValidationRules {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string;
}

