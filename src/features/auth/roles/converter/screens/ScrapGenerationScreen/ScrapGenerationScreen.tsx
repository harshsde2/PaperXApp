import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { ScrapGenerationScreenNavigationProp, ScrapCategory } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const SCRAP_CATEGORIES: ScrapCategory[] = [
  {
    id: 'paper-board-scrap',
    title: 'Paper & Board Scrap',
    options: [
      { id: 'white-cuttings', label: 'White Cuttings' },
      { id: 'kraft-cuttings', label: 'Kraft Cuttings' },
      { id: 'corrugated-clippings', label: 'Corrugated Clippings' },
      { id: 'mixed-paper', label: 'Mixed Paper' },
    ],
    icon: AppIcon.Scrap,
  },
  {
    id: 'process-scrap',
    title: 'Process Scrap',
    options: [
      { id: 'reel-ends', label: 'Reel Ends' },
      { id: 'core-waste', label: 'Core Waste' },
    ],
    icon: AppIcon.Process,
  },
  {
    id: 'finishing-scrap',
    title: 'Finishing Scrap',
    options: [
      { id: 'die-cut-skeletons', label: 'Die-cut Skeletons' },
      { id: 'trimmings', label: 'Trimmings' },
    ],
    icon: AppIcon.Finishing,
  },
];

const ScrapGenerationScreen = () => {
  const navigation = useNavigation<ScrapGenerationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ScrapGeneration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [generatesScrap, setGeneratesScrap] = useState<boolean | null>(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['paper-board-scrap']),
  );
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(['white-cuttings', 'corrugated-clippings', 'trimmings']),
  );

  const currentStep = 4;
  const totalSteps = 6;
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
    const section = SCRAP_CATEGORIES.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // TODO: Save selections to API/state
    // Navigate to next screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.PRODUCTION_CAPACITY, { profileData });
  };

  const handleSaveAndExit = () => {
    // TODO: Save progress and navigate back or to dashboard
    navigation.goBack();
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
          Do you generate scrap?
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          We'll help match you with buyers interested in the specific recyclable
          waste your facility produces.
        </Text>

        {/* Yes/No Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              generatesScrap === false && styles.toggleButtonSelected,
            ]}
            onPress={() => setGeneratesScrap(false)}
            activeOpacity={0.7}
          >
            <Text
              variant="bodyMedium"
              fontWeight="medium"
              style={[
                styles.toggleButtonText,
                generatesScrap === false && styles.toggleButtonTextSelected,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              generatesScrap === true && styles.toggleButtonSelected,
            ]}
            onPress={() => setGeneratesScrap(true)}
            activeOpacity={0.7}
          >
            <Text
              variant="bodyMedium"
              fontWeight="medium"
              style={[
                styles.toggleButtonText,
                generatesScrap === true && styles.toggleButtonTextSelected,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrap Categories Section */}
        {generatesScrap === true && (
          <>
            <Text variant="h6" fontWeight="bold" style={styles.sectionTitle}>
              SELECT SCRAP CATEGORIES
            </Text>

            {SCRAP_CATEGORIES.map(category => {
              const isExpanded = expandedSections.has(category.id);
              const selectedCount = getSelectedCountForSection(category.id);
                const Icon = category.icon;
              return (
                <Card key={category.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleSection(category.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryHeaderLeft}>
                      {/* Icon placeholder - replace with actual icon when available */}
                      <View style={styles.categoryIcon}>
                        <Icon width={30} height={30} color={theme.colors.text.primary} />
                      </View>
                      <Text
                        variant="h6"
                        fontWeight="semibold"
                        style={styles.categoryTitle}
                      >
                        {category.title}
                      </Text>
                    </View>
                    <View style={isExpanded && styles.chevronRotated}>
                      <AppIcon.ChevronDown
                        width={20}
                        height={20}
                        color={theme.colors.text.tertiary}
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && category.options.length > 0 && (
                    <View style={styles.optionsContainer}>
                      {category.options.map(option => {
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
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.backButtonText}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.continueButtonText}>
            Continue
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

export default ScrapGenerationScreen;
