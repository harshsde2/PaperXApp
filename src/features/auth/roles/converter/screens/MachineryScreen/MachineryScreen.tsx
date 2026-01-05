import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { MachineryScreenNavigationProp, MachinerySection } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

const MACHINERY_SECTIONS: MachinerySection[] = [
  {
    id: 'printing-machines',
    title: 'Printing Machines',
    options: [
      { id: 'offset', label: 'Offset' },
      { id: 'flexo', label: 'Flexo' },
      { id: 'digital', label: 'Digital' },
      { id: 'rotogravure', label: 'Rotogravure' },
      { id: 'screen-printing', label: 'Screen Printing' },
      { id: 'letterpress', label: 'Letterpress' },
    ],
  },
  {
    id: 'die-cutting-machines',
    title: 'Die-Cutting Machines',
    options: [],
  },
  {
    id: 'corrugation-machines',
    title: 'Corrugation Machines',
    options: [],
  },
  {
    id: 'finishing-machines',
    title: 'Finishing Machines',
    options: [],
  },
  {
    id: 'folding-gluing-assembly',
    title: 'Folding, Gluing & Assembly',
    options: [],
  },
];

const MachineryScreen = () => {
  const navigation = useNavigation<MachineryScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['printing-machines'])
  );
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(['offset', 'flexo', 'rotogravure'])
  );
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const currentStep = 3;
  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

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
    const section = MACHINERY_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  const handleCustomInputChange = (sectionId: string, value: string) => {
    setCustomInputs(prev => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const handleSkip = () => {
    // TODO: Navigate to next screen without saving
    // navigation.navigate(SCREENS.AUTH.SCRAP_GENERATION);
  };

  const handleSaveAndContinue = () => {
    // TODO: Save selections and navigate to next screen
    navigation.navigate(SCREENS.AUTH.SCRAP_GENERATION);
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
          Select your machinery.
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Tap to expand categories and select the equipment currently active in your facility.
        </Text>

        {/* Machinery Sections */}
        {MACHINERY_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const selectedCount = getSelectedCountForSection(section.id);
          const customInput = customInputs[section.id] || '';

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
                  {!isExpanded && (
                    <Text variant="bodySmall" style={styles.sectionSubtitle}>
                      {selectedCount === 0 ? 'None Selected' : `${selectedCount} Selected`}
                    </Text>
                  )}
                </View>
                {selectedCount > 0 && isExpanded && (
                  <View style={styles.badge}>
                    <Text variant="captionSmall" fontWeight="semibold" style={styles.badgeText}>
                      {selectedCount} Selected
                    </Text>
                  </View>
                )}
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
                  <View style={styles.chipsContainer}>
                    {section.options.map((option) => {
                      const isSelected = selectedOptions.has(option.id);
                      return (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                          onPress={() => toggleOption(option.id)}
                          activeOpacity={0.7}
                        >
                          <Text
                            variant="bodySmall"
                            fontWeight="medium"
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TextInput
                    style={styles.customInput}
                    placeholder={`Add other ${section.title.toLowerCase()}...`}
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={customInput}
                    onChangeText={(value) => handleCustomInputChange(section.id, value)}
                  />
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveContinueButton}
          onPress={handleSaveAndContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.saveContinueButtonText}>
            Save & Continue
          </Text>
          <AppIcon.ArrowRight
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default MachineryScreen;

