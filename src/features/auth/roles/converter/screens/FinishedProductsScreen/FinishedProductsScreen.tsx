import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { FinishedProductsScreenNavigationProp, FinishedProductSection } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const FINISHED_PRODUCT_SECTIONS: FinishedProductSection[] = [
  {
    id: 'packaging',
    title: 'PACKAGING',
    options: [
      { id: 'corrugated-boxes-rsc-die-cut', label: 'Corrugated Boxes (RSC, Die-cut)' },
      { id: 'mono-cartons', label: 'Mono Cartons' },
      { id: 'paper-bags-kraft-white', label: 'Paper Bags (Kraft/White)' },
      { id: 'flexible-laminates', label: 'Flexible Laminates' },
    ],
  },
  {
    id: 'premium-gifting',
    title: 'PREMIUM / GIFTING',
    options: [],
  },
  {
    id: 'food-beverage',
    title: 'FOOD & BEVERAGE',
    options: [],
  },
  {
    id: 'print-stationery',
    title: 'PRINT & STATIONERY',
    options: [],
  },
  {
    id: 'labels-tags',
    title: 'LABELS & TAGS',
    options: [],
  },
  {
    id: 'industrial-products',
    title: 'INDUSTRIAL PRODUCTS',
    options: [],
  },
];

const FinishedProductsScreen = () => {
  const navigation = useNavigation<FinishedProductsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'FinishedProducts'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['packaging'])
  );
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(['corrugated-boxes-rsc-die-cut', 'mono-cartons'])
  );
  const [customProduct, setCustomProduct] = useState('');

  const currentStep = 3;
  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return FINISHED_PRODUCT_SECTIONS;
    }

    const query = searchQuery.toLowerCase();
    return FINISHED_PRODUCT_SECTIONS.map(section => ({
      ...section,
      options: section.options.filter(option =>
        option.label.toLowerCase().includes(query) ||
        section.title.toLowerCase().includes(query)
      ),
    })).filter(section => 
      section.options.length > 0 || section.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleOption = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const getSelectedCountForSection = (sectionId: string) => {
    const section = FINISHED_PRODUCT_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  const totalSelectedCount = selectedOptions.size;

  const handleSaveForLater = () => {
    // TODO: Save progress and navigate back or to dashboard
    navigation.goBack();
  };

  const handleContinue = () => {
    // TODO: Save selections to API/state
    // Navigate to next screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.MACHINERY, { profileData });
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text variant="h3" fontWeight="bold" style={styles.title}>
          What finished products do you manufacture?
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Select all the finished goods that are part of your production portfolio. This helps us match you with relevant buyers.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <AppIcon.Search
              width={20}
              height={20}
              color={theme.colors.text.tertiary}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for finished products..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Product Sections */}
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const selectedCount = getSelectedCountForSection(section.id);

          return (
            <Card key={section.id} style={styles.card}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeaderLeft}>
                  <Text variant="h6" fontWeight="bold" style={styles.sectionTitle}>
                    {section.title}
                  </Text>
                  {selectedCount > 0 && (
                    <View style={styles.badge}>
                      <Text variant="captionSmall" fontWeight="semibold" style={styles.badgeText}>
                        {selectedCount} Selected
                      </Text>
                    </View>
                  )}
                </View>
                <View style={isExpanded && styles.chevronRotated}>
                  <AppIcon.ChevronDown
                    width={20}
                    height={20}
                    color={theme.colors.text.tertiary}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && section.options.length > 0 && (
                <View style={styles.optionsContainer}>
                  {section.options.map((option) => {
                    const isSelected = selectedOptions.has(option.id);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.optionRow}
                        onPress={() => toggleOption(option.id)}
                        activeOpacity={0.7}
                      >
                        {isSelected ? (
                          <AppIcon.TickCheckedBox
                            width={24}
                            height={24}
                            color={theme.colors.primary.DEFAULT}
                          />
                        ) : (
                          <AppIcon.UntickCheckedBox
                            width={24}
                            height={24}
                            color={theme.colors.border.primary}
                          />
                        )}
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })}

        {/* Product not listed */}
        <Card style={styles.card}>
          <Text variant="bodyMedium" fontWeight="semibold" style={styles.customSectionTitle}>
            Product not listed?
          </Text>
          <TextInput
            style={styles.customInput}
            placeholder="Type here..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={customProduct}
            onChangeText={setCustomProduct}
          />
        </Card>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text variant="h6" style={styles.footerSummaryLabel}>
            SELECTION SUMMARY
          </Text>
          <Text variant="h6" fontWeight="semibold" style={styles.footerSummaryCount}>
            {totalSelectedCount} Products Selected
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.continueButtonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default FinishedProductsScreen;

