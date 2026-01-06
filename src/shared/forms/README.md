# Forms Module

A comprehensive form handling solution using React Hook Form, designed for React Native.

## Features

- ✅ Type-safe form handling with TypeScript
- ✅ Reusable form components (FormInput, FormSelect)
- ✅ Common validation rules (email, mobile, password, etc.)
- ✅ Easy integration with existing components
- ✅ Optimized for React Native performance

## Installation

React Hook Form is already installed. The forms module is ready to use!

## Quick Start

### Basic Form Example

```tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { Text } from '@shared/components/Text';

type LoginForm = {
  mobile: string;
};

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    defaultValues: {
      mobile: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: LoginForm) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <View>
      <FormInput
        name="mobile"
        control={control}
        label="Mobile Number"
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        rules={validationRules.mobile()}
      />

      <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## API Reference

### Hooks

#### `useForm<T>`

Enhanced wrapper around React Hook Form's `useForm` with sensible defaults.

```tsx
const { control, handleSubmit, formState, watch, setValue, reset } = useForm<FormData>({
  defaultValues: { ... },
  mode: 'onBlur', // 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
});
```

### Components

#### `FormInput<T>`

TextInput component integrated with React Hook Form.

**Props:**
- `name`: Field name (required)
- `control`: Form control object (required)
- `rules`: Validation rules (optional)
- `label`: Label text (optional)
- `helperText`: Helper text shown below input (optional)
- `errorMessage`: Custom error message (optional)
- `showError`: Show error message (default: true)
- `showLabel`: Show label (default: true)
- All standard `TextInput` props

**Example:**
```tsx
<FormInput
  name="email"
  control={control}
  label="Email Address"
  placeholder="Enter your email"
  keyboardType="email-address"
  autoCapitalize="none"
  rules={validationRules.combine(
    validationRules.required(),
    validationRules.email()
  )}
/>
```

#### `FormSelect<T>`

Select/Dropdown component integrated with React Hook Form.

**Props:**
- `name`: Field name (required)
- `control`: Form control object (required)
- `options`: Array of `{ label: string, value: string | number }` (required)
- `placeholder`: Placeholder text (optional)
- `onPress`: Callback when select is pressed (use to open picker/modal)
- All other props similar to `FormInput`

**Example:**
```tsx
<FormSelect
  name="state"
  control={control}
  label="State"
  placeholder="Select State"
  options={[
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Gujarat', value: 'GJ' },
  ]}
  onPress={(value) => {
    // Open your picker/modal here
    openStatePicker(value);
  }}
/>
```

### Validation Rules

Pre-built validation rules available in `validationRules`:

- `required(message?)` - Required field
- `email(message?)` - Email validation
- `mobile(message?)` - 10-digit mobile number
- `gstin(message?)` - 15-digit GSTIN
- `password(minLength?, message?)` - Password with min length
- `strongPassword(message?)` - Strong password (uppercase, lowercase, number, special char)
- `number(message?)` - Numeric validation
- `positiveNumber(message?)` - Positive number
- `url(message?)` - URL validation
- `combine(...rules)` - Combine multiple rules

**Example:**
```tsx
// Single rule
rules={validationRules.mobile()}

// Multiple rules
rules={validationRules.combine(
  validationRules.required('Mobile number is required'),
  validationRules.mobile('Please enter a valid 10-digit number')
)}
```

### Custom Validation

```tsx
import { createValidationRule } from '@shared/forms';

const customRule = createValidationRule(
  (value) => {
    if (value.length < 5) {
      return 'Must be at least 5 characters';
    }
    return true;
  },
  'Custom validation failed'
);

// Use in form
<FormInput
  name="customField"
  control={control}
  rules={customRule}
/>
```

## Advanced Usage

### Using Controller for Custom Components

If you need to integrate with custom components that don't work with `FormInput`:

```tsx
import { Controller } from 'react-hook-form';

<Controller
  control={control}
  name="customField"
  rules={validationRules.required()}
  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
    <YourCustomComponent
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error?.message}
    />
  )}
/>
```

### Form State Management

```tsx
const { 
  formState: { 
    errors,        // Form errors
    isValid,       // Is form valid
    isDirty,       // Has form been modified
    isSubmitting,  // Is form submitting
    touchedFields, // Fields that have been touched
    dirtyFields,   // Fields that have been modified
  } 
} = useForm<FormData>();
```

### Programmatic Form Control

```tsx
const { setValue, watch, reset } = useForm<FormData>();

// Set value programmatically
setValue('mobile', '1234567890');

// Watch field value
const mobileValue = watch('mobile');

// Reset form
reset({ mobile: '' });
```

## Migration Guide

### From useState to useForm

**Before:**
```tsx
const [mobile, setMobile] = useState('');

<TextInput
  value={mobile}
  onChangeText={setMobile}
/>
```

**After:**
```tsx
const { control } = useForm<{ mobile: string }>({
  defaultValues: { mobile: '' }
});

<FormInput
  name="mobile"
  control={control}
/>
```

## Best Practices

1. **Always define TypeScript types** for your form data
2. **Use appropriate validation mode** (`onBlur` for better UX, `onSubmit` for performance)
3. **Combine validation rules** when you need multiple validations
4. **Use helper text** to guide users on what to enter
5. **Handle form submission** with proper loading states

## Examples

See the following files for real-world examples:
- `LoginScreen.tsx` - Simple form with mobile validation
- `CompanyDetailsScreen.tsx` - Complex form with multiple fields

