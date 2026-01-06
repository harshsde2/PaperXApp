import { RegisterOptions } from 'react-hook-form';

export const validationRules = {
  required: (message = 'This field is required'): RegisterOptions => ({
    required: message,
  }),

  email: (message = 'Please enter a valid email address'): RegisterOptions => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),

  mobile: (message = 'Please enter a valid 10-digit mobile number'): RegisterOptions => ({
    pattern: {
      value: /^[0-9]{10}$/,
      message,
    },
    minLength: {
      value: 10,
      message,
    },
    maxLength: {
      value: 10,
      message,
    },
  }),

  gstin: (message = 'Please enter a valid 15-digit GSTIN'): RegisterOptions => ({
    pattern: {
      value: /^[0-9A-Z]{15}$/,
      message,
    },
    minLength: {
      value: 15,
      message,
    },
    maxLength: {
      value: 15,
      message,
    },
  }),

  password: (
    minLength = 8,
    message = `Password must be at least ${minLength} characters`
  ): RegisterOptions => ({
    minLength: {
      value: minLength,
      message,
    },
  }),

  strongPassword: (message = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'): RegisterOptions => ({
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message,
    },
  }),

  number: (message = 'Please enter a valid number'): RegisterOptions => ({
    pattern: {
      value: /^\d+$/,
      message,
    },
  }),

  positiveNumber: (message = 'Please enter a positive number'): RegisterOptions => ({
    validate: (value) => {
      const num = Number(value);
      return num > 0 || message;
    },
  }),

  url: (message = 'Please enter a valid URL'): RegisterOptions => ({
    pattern: {
      value: /^https?:\/\/.+/,
      message,
    },
  }),

  combine: (...rules: RegisterOptions[]): RegisterOptions => {
    return rules.reduce((acc, rule) => ({ ...acc, ...rule }) as unknown as RegisterOptions, {} as RegisterOptions);
  },
};

export const createValidationRule = (
  validator: (value: any) => boolean | string,
  message?: string
): RegisterOptions => ({
  validate: (value) => {
    const result = validator(value);
    if (result === true) return true;
    if (typeof result === 'string') return result;
    return message || 'Validation failed';
  },
});

