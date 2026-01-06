/**
 * Example: Complex Form with Multiple Fields
 * 
 * This example shows how to handle a complex form with multiple fields,
 * including text inputs, selects, and file uploads.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm, FormInput, FormSelect, validationRules } from '@shared/forms';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import { RegisterOptions } from 'react-hook-form';

// Define form data type
type CompanyDetailsFormData = {
  companyName: string;
  gstin: string;
  state: string;
  city: string;
};

/**
 * Example Company Details Form
 * 
 * This demonstrates:
 * - Multiple form fields
 * - Optional fields (GSTIN)
 * - Select/dropdown fields
 * - Combining multiple validation rules
 */
export const CompanyDetailsFormExample = () => {
  const theme = useTheme();
  const [isStatePickerOpen, setIsStatePickerOpen] = useState(false);

  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CompanyDetailsFormData>({
    defaultValues: {
      companyName: '',
      gstin: '',
      state: '',
      city: '',
    },
    mode: 'onBlur',
  });

  // Watch state value to enable/disable city field
  const selectedState = watch('state');

  // State options (example)
  const stateOptions = [
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Karnataka', value: 'KA' },
    { label: 'Tamil Nadu', value: 'TN' },
  ];

  const onSubmit = async (data: CompanyDetailsFormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const handleStateSelect = (value: string) => {
    // This would typically open a picker modal
    // For now, just setting the value
    setValue('state', value);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="h2" style={{ marginBottom: 24 }}>
        Company Details
      </Text>

      {/* Company Name - Required */}
      <FormInput
        name="companyName"
        control={control}
        label="Company Name"
        placeholder="e.g. Apex Packaging Solutions"
        rules={validationRules.required('Company name is required') as RegisterOptions<CompanyDetailsFormData>}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* GSTIN - Optional */}
      <FormInput
        name="gstin"
        control={control}
        label="GSTIN"
        placeholder="15-DIGIT GST NUMBER"
        helperText="Auto-verifies your business type"
        rules={validationRules.gstin() as RegisterOptions<CompanyDetailsFormData>}
        maxLength={15}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* State - Required, Select */}
      <FormSelect
        name="state"
        control={control}
        label="State"
        placeholder="Select State"
        options={stateOptions}
        rules={validationRules.required('Please select a state') as RegisterOptions<CompanyDetailsFormData>}
        onPress={(value) => handleStateSelect(value as string)}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* City - Required, depends on state */}
      <FormInput
        name="city"
        control={control}
        label="City"
        placeholder="Search City"
        rules={validationRules.combine(
          validationRules.required('City is required'),
          // Add custom validation: city required if state is selected
          {
            validate: (value) => {
              if (selectedState && !value) {
                return 'City is required when state is selected';
              }
              return true;
            },
          }
        ) as RegisterOptions<CompanyDetailsFormData>}
        containerStyle={{ marginBottom: 24 }}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary.DEFAULT,
          padding: 16,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isValid ? 1 : 0.6,
        }}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        <Text
          variant="buttonMedium"
          style={{ color: theme.colors.text.inverse, marginRight: 8 }}
        >
          Save & Continue
        </Text>
        <AppIcon.ArrowRight
          width={20}
          height={20}
          color={theme.colors.text.inverse}
        />
      </TouchableOpacity>
    </View>
  );
};

