import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, TextInput, ScrollView, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import { INITIAL_ADVANCED_FILTERS } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { AdvancedFilterState } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { MarketplaceFilterSheetProps, LeadTimeOption } from './@types';
import { createStyles } from './styles';

const LEAD_TIME_OPTIONS: LeadTimeOption[] = [
  { value: 'SAME_DAY', label: 'Same Day' },
  { value: 'H24', label: '24 Hours' },
  { value: 'H48', label: '48 Hours' },
  { value: 'DAYS_3_5', label: '3-5 Days' },
];

const BRANDING_OPTIONS = [
  { value: 'yes' as const, label: 'Yes' },
  { value: 'no' as const, label: 'No' },
];

export const MarketplaceFilterSheet = memo<MarketplaceFilterSheetProps>(
  function MarketplaceFilterSheet({ filters, onApply, onReset }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [draft, setDraft] = useState<AdvancedFilterState>(filters);

    useEffect(() => {
      setDraft(filters);
    }, [filters]);

    const updateField = useCallback(
      <K extends keyof AdvancedFilterState>(key: K, value: AdvancedFilterState[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
      },
      [],
    );

    const handleLeadTimePress = useCallback(
      (value: string) => {
        setDraft((prev) => ({
          ...prev,
          lead_time: prev.lead_time === value ? '' : value,
        }));
      },
      [],
    );

    const handleBrandingPress = useCallback(
      (value: 'yes' | 'no') => {
        setDraft((prev) => ({
          ...prev,
          has_branding: prev.has_branding === value ? null : value,
        }));
      },
      [],
    );

    const handleApply = useCallback(() => {
      onApply(draft);
    }, [draft, onApply]);

    const handleReset = useCallback(() => {
      setDraft(INITIAL_ADVANCED_FILTERS);
      onReset();
    }, [onReset]);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h4" fontWeight="semibold" style={styles.headerTitle}>
            Filters
          </Text>
          <Pressable onPress={handleReset} hitSlop={8}>
            <Text variant="bodyMedium" style={styles.resetText}>
              Reset
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Location
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Search by location"
              placeholderTextColor={theme.colors.text.tertiary}
              value={draft.delivery_geography}
              onChangeText={(text) => updateField('delivery_geography', text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Dispatch Time
            </Text>
            <View style={styles.chipsRow}>
              {LEAD_TIME_OPTIONS.map((opt) => {
                const isActive = draft.lead_time === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleLeadTimePress(opt.value)}
                    style={[
                      styles.chip,
                      isActive ? styles.chipActive : styles.chipInactive,
                    ]}
                  >
                    <Text
                      variant="captionLarge"
                      style={isActive ? styles.chipTextActive : styles.chipTextInactive}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Price per Piece (₹)
            </Text>
            <View style={styles.rangeRow}>
              <TextInput
                style={styles.rangeInput}
                placeholder="Min"
                placeholderTextColor={theme.colors.text.tertiary}
                value={draft.min_price}
                onChangeText={(text) => updateField('min_price', text)}
                keyboardType="numeric"
              />
              <Text variant="bodyMedium" style={styles.rangeSeparator}>
                to
              </Text>
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={theme.colors.text.tertiary}
                value={draft.max_price}
                onChangeText={(text) => updateField('max_price', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              MOQ (Minimum Order Quantity)
            </Text>
            <View style={styles.rangeRow}>
              <TextInput
                style={styles.rangeInput}
                placeholder="Min"
                placeholderTextColor={theme.colors.text.tertiary}
                value={draft.min_moq}
                onChangeText={(text) => updateField('min_moq', text)}
                keyboardType="numeric"
              />
              <Text variant="bodyMedium" style={styles.rangeSeparator}>
                to
              </Text>
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={theme.colors.text.tertiary}
                value={draft.max_moq}
                onChangeText={(text) => updateField('max_moq', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Need Branding on Product
            </Text>
            <View style={styles.chipsRow}>
              {BRANDING_OPTIONS.map((opt) => {
                const isActive = draft.has_branding === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleBrandingPress(opt.value)}
                    style={[
                      styles.chip,
                      isActive ? styles.chipActive : styles.chipInactive,
                    ]}
                  >
                    <Text
                      variant="captionLarge"
                      style={isActive ? styles.chipTextActive : styles.chipTextInactive}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </View>
    );
  },
);
