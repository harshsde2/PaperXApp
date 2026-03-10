import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, TextInput, ScrollView, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { PriceRangeSlider } from '@shared/components/PriceRangeSlider';
import { useTheme } from '@theme/index';
import { INITIAL_ADVANCED_FILTERS } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { AdvancedFilterState } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { MarketplaceFilterSheetProps, LeadTimeOption } from './@types';
import { createStyles } from './styles';

const LEAD_TIME_OPTIONS: LeadTimeOption[] = [
  { value: 'H24', label: 'Within 24 hours' },
  { value: 'H48', label: '24-48 hours' },
  { value: 'DAYS_3_5', label: '48-72 hours' },
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

    const PRICE_MIN = 0;
    const PRICE_MAX = 1000;
    const handleMinPriceChange = useCallback((value: string) => {
      setDraft((prev) => {
        const num = parseFloat(value);
        if (value === '' || value === '-') {
          return { ...prev, min_price: value };
        }
        if (!Number.isFinite(num)) return prev;
        const minClamped = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Math.round(num)));
        const maxNum = parseFloat(prev.max_price) || PRICE_MAX;
        if (minClamped >= maxNum) {
          const newMax = Math.min(minClamped + 1, PRICE_MAX);
          return { ...prev, min_price: String(minClamped), max_price: String(newMax) };
        }
        return { ...prev, min_price: String(minClamped) };
      });
    }, []);

    const handleMaxPriceChange = useCallback((value: string) => {
      setDraft((prev) => {
        const num = parseFloat(value);
        if (value === '' || value === '-') {
          return { ...prev, max_price: value };
        }
        if (!Number.isFinite(num)) return prev;
        const maxClamped = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Math.round(num)));
        const minNum = parseFloat(prev.min_price) || PRICE_MIN;
        if (maxClamped <= minNum) {
          const newMin = Math.max(maxClamped - 1, PRICE_MIN);
          return { ...prev, max_price: String(maxClamped), min_price: String(newMin) };
        }
        return { ...prev, max_price: String(maxClamped) };
      });
    }, []);

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
              Price per Piece (₹) 0 – 1000
            </Text>
            <PriceRangeSlider
              minPrice={draft.min_price}
              maxPrice={draft.max_price}
              onMinChange={handleMinPriceChange}
              onMaxChange={handleMaxPriceChange}
              rangeMin={0}
              rangeMax={1000}
            />
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              MOQ (Maximum)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 500"
              placeholderTextColor={theme.colors.text.tertiary}
              value={draft.moq}
              onChangeText={(text) => updateField('moq', text)}
              keyboardType="numeric"
            />
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
