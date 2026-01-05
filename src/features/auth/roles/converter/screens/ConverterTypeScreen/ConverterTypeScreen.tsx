import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { ConverterTypeScreenNavigationProp, ConverterTypeSection } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

const CONVERTER_TYPE_SECTIONS: ConverterTypeSection[] = [
  {
    id: 'corrugated-packaging',
    title: 'CORRUGATED PACKAGING',
    options: [
      { id: '3-ply-5-ply-7-ply-automatic-board', label: '3 Ply / 5 Ply / 7 Ply Automatic Board' },
      { id: 'die-cut-boxes', label: 'Die Cut Boxes' },
      { id: 'heavy-duty-packaging', label: 'Heavy Duty Packaging' },
    ],
  },
  {
    id: 'rigid-setup-luxury-boxes',
    title: 'RIGID, SET-UP & LUXURY BOXES',
    options: [],
  },
  {
    id: 'folding-carton-mono-carton',
    title: 'FOLDING CARTON / MONO CARTON',
    options: [],
  },
  {
    id: 'printing-commercial-specialised',
    title: 'PRINTING - COMMERCIAL & SPECIALISED',
    options: [],
  },
  {
    id: 'labels-tags-identification',
    title: 'LABELS, TAGS & IDENTIFICATION',
    options: [],
  },
  {
    id: 'books-stationery-education',
    title: 'BOOKS, STATIONERY & EDUCATION',
    options: [],
  },
  {
    id: 'paper-bags-flexible-packaging',
    title: 'PAPER BAGS & FLEXIBLE PACKAGING',
    options: [],
  },
  {
    id: 'food-service-disposables',
    title: 'FOOD SERVICE & DISPOSABLES',
    options: [],
  },
];

const ConverterTypeScreen = () => {
  const navigation = useNavigation<ConverterTypeScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['corrugated-packaging'])
  );
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(['3-ply-5-ply-7-ply-automatic-board', 'die-cut-boxes'])
  );
  const [otherConverterType, setOtherConverterType] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return CONVERTER_TYPE_SECTIONS;
    }

    const query = searchQuery.toLowerCase();
    return CONVERTER_TYPE_SECTIONS.map(section => ({
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
    const section = CONVERTER_TYPE_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  const totalSelectedCount = selectedOptions.size;

  const handleSaveForLater = () => {
    // TODO: Save progress and navigate back or to dashboard
    navigation.goBack();
  };

  const handleContinue = () => {
    // TODO: Save selections and navigate to next screen
    navigation.navigate(SCREENS.AUTH.FINISHED_PRODUCTS);
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
          Select your Converter / Manufacturer Type
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          You can select multiple options that best describe your manufacturing capabilities.
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
            placeholder="Search for box types, printing..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Converter Type Sections */}
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
                      <Text variant="captionSmall" style={styles.badgeText}>
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
                          variant='bodySmall'
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

        {/* Other Converter Type */}
        <Card style={styles.card}>
          <Text variant="bodyMedium" fontWeight="semibold" style={styles.otherSectionTitle}>
            Other Converter Type
          </Text>
          <TextInput
            style={styles.otherInput}
            placeholder="If your converter type is not listed above, please specify here..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={otherConverterType}
            onChangeText={setOtherConverterType}
            multiline
          />
        </Card>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text variant='h6' style={styles.footerSummaryLabel}>
            SELECTION SUMMARY
          </Text>
          <Text variant='h6' fontWeight="bold" color={theme.colors.primary.DEFAULT} style={styles.footerSummaryCount}>
            {totalSelectedCount} Types Selected
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

export default ConverterTypeScreen;

