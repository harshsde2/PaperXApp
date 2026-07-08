import React, { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { PriceRangeSlider } from '@shared/components/PriceRangeSlider';
import { useTheme } from '@theme/index';
import { RTD_CATEGORY_OPTIONS } from '@features/converter/rtd/screens/ConverterRTDAddProductScreen/constants';
import { INITIAL_ADVANCED_FILTERS } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { AdvancedFilterState, MoqRange, LocationScope } from '../../screens/BrandRTDMarketplaceScreen/@types';
import type { MarketplaceFilterSheetProps, LeadTimeOption } from './@types';
import { createStyles } from './styles';

const LEAD_TIME_OPTIONS: LeadTimeOption[] = [
  { value: 'SAME_DAY', label: 'Same Day' },
  { value: 'H24', label: 'Within 24 hours' },
  { value: 'H48', label: '24-48 hours' },
  { value: 'DAYS_3_5', label: '48-72 hours' },
];

const BRANDING_OPTIONS = [
  { value: 'yes' as const, label: 'Yes' },
  { value: 'no' as const, label: 'No' },
];

const MOQ_RANGE_OPTIONS: { value: MoqRange; label: string }[] = [
  { value: '0-50', label: '0 – 50' },
  { value: '50-500', label: '50 – 500' },
  { value: '500+', label: '500+' },
];

const LOCATION_SCOPE_OPTIONS: { value: LocationScope; label: string }[] = [
  { value: 'city', label: 'Same City' },
  { value: 'state', label: 'Same State' },
  { value: 'pan_india', label: 'Pan India' },
];

export const MarketplaceFilterSheet = memo<MarketplaceFilterSheetProps>(
  function MarketplaceFilterSheet({ filters, onApply, onReset }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [draft, setDraft] = useState<AdvancedFilterState>(filters);
    const [categorySearch, setCategorySearch] = useState('');

    useEffect(() => {
      setDraft(filters);
    }, [filters]);

    const filteredCategories = useMemo(() => {
      const q = categorySearch.trim().toLowerCase();
      if (!q) return RTD_CATEGORY_OPTIONS;
      return RTD_CATEGORY_OPTIONS.filter((c) => c.toLowerCase().includes(q));
    }, [categorySearch]);

    const PRICE_MIN = 0;
    const PRICE_MAX = 10000;
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

    const handleMoqRangePress = useCallback(
      (value: MoqRange) => {
        setDraft((prev) => ({
          ...prev,
          moq_range: prev.moq_range === value ? '' : value,
        }));
      },
      [],
    );

    const handleCategorySelect = useCallback((value: string) => {
      setDraft((prev) => ({
        ...prev,
        categories: prev.categories.includes(value)
          ? prev.categories.filter((c) => c !== value)
          : [...prev.categories, value],
      }));
      setCategorySearch('');
    }, []);

    const handleRemoveCategory = useCallback((value: string) => {
      setDraft((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== value),
      }));
    }, []);

    const handleUseCaseChange = useCallback((value: string) => {
      setDraft((prev) => ({ ...prev, product_use_case: value }));
    }, []);

    const handleLocationScopePress = useCallback(
      (value: LocationScope) => {
        setDraft((prev) => ({
          ...prev,
          location_scope: prev.location_scope === value ? '' : value,
        }));
      },
      [],
    );

    const handleApply = useCallback(() => {
      onApply(draft);
    }, [draft, onApply]);

    const handleReset = useCallback(() => {
      setDraft(INITIAL_ADVANCED_FILTERS);
      setCategorySearch('');
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
              Category
            </Text>

            {draft.categories.length > 0 ? (
              <View style={styles.selectedCategoriesWrap}>
                {draft.categories.map((cat) => (
                  <Pressable
                    key={cat}
                    style={styles.selectedCategoryChip}
                    onPress={() => handleRemoveCategory(cat)}
                  >
                    <Text variant="captionLarge" style={styles.selectedCategoryText} numberOfLines={1}>
                      {cat}
                    </Text>
                    <AppIcon.Close width={14} height={14} color={theme.colors.primary.DEFAULT} />
                  </Pressable>
                ))}
              </View>
            ) : null}

            <TextInput
              style={styles.categorySearchInput}
              placeholder="Search category..."
              placeholderTextColor={theme.colors.text.placeholder ?? theme.colors.text.tertiary}
              value={categorySearch}
              onChangeText={setCategorySearch}
              returnKeyType="done"
            />

            <ScrollView
                style={styles.categoryDropdown}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                bounces={false}
              >
                {filteredCategories.map((cat) => {
                  const isActive = draft.categories.includes(cat);
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => handleCategorySelect(cat)}
                      style={[
                        styles.categoryDropdownItem,
                        isActive && styles.categoryDropdownItemActive,
                      ]}
                    >
                      <Text
                        variant="bodySmall"
                        style={isActive ? styles.categoryDropdownTextActive : styles.categoryDropdownText}
                        numberOfLines={1}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
                {filteredCategories.length === 0 && (
                  <View style={styles.categoryDropdownItem}>
                    <Text variant="bodySmall" style={styles.categoryDropdownText}>
                      No categories found
                    </Text>
                  </View>
                )}
              </ScrollView>
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              What is your product for which you are finding packaging?
            </Text>
            <TextInput
              style={styles.categorySearchInput}
              placeholder="e.g. chocolates, electronics, apparels"
              placeholderTextColor={theme.colors.text.placeholder ?? theme.colors.text.tertiary}
              value={draft.product_use_case}
              onChangeText={handleUseCaseChange}
              returnKeyType="done"
            />
            <Text variant="captionSmall" style={styles.sectionHelperText}>
              This helps us narrow down your search.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Dispatch Time Set by Manufacturers
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
              Location
            </Text>
            <View style={styles.chipsRow}>
              {LOCATION_SCOPE_OPTIONS.map((opt) => {
                const isActive = draft.location_scope === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleLocationScopePress(opt.value)}
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
              Min. Order Quantity
            </Text>
            <View style={styles.chipsRow}>
              {MOQ_RANGE_OPTIONS.map((opt) => {
                const isActive = draft.moq_range === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleMoqRangePress(opt.value)}
                    style={[
                      styles.chip,
                      styles.chipTab,
                      isActive ? styles.chipActive : styles.chipInactive,
                    ]}
                  >
                    <Text
                      variant="captionLarge"
                      fontWeight={isActive ? 'semibold' : 'regular'}
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
              Price per Piece (₹) 0 – 10000
            </Text>
            <PriceRangeSlider
              minPrice={draft.min_price}
              maxPrice={draft.max_price}
              onMinChange={handleMinPriceChange}
              onMaxChange={handleMaxPriceChange}
              rangeMin={0}
              rangeMax={10000}
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
