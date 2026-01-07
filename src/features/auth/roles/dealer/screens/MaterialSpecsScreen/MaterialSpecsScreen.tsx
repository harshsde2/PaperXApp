import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { MaterialSpecsScreenNavigationProp, SpecSection } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const SPEC_SECTIONS: SpecSection[] = [
  {
    id: 'finish',
    title: 'Finish',
    options: [
      { id: 'gloss', label: 'Gloss' },
      { id: 'matte', label: 'Matte' },
      { id: 'satin', label: 'Satin' },
      { id: 'soft-touch', label: 'Soft Touch' },
      { id: 'varnish', label: 'Varnish' },
    ],
  },
  {
    id: 'coating',
    title: 'Coating',
    options: [
      { id: 'uv-coating', label: 'UV Coating' },
      { id: 'lamination', label: 'Lamination' },
      { id: 'aqueous', label: 'Aqueous' },
    ],
  },
  {
    id: 'surface',
    title: 'Surface',
    options: [
      { id: 'smooth', label: 'Smooth' },
      { id: 'textured', label: 'Textured' },
      { id: 'embossed', label: 'Embossed' },
    ],
  },
  {
    id: 'print-compatibility',
    title: 'Print Compatibility',
    options: [
      { id: 'offset', label: 'Offset' },
      { id: 'digital', label: 'Digital' },
      { id: 'flexo', label: 'Flexo' },
    ],
  },
];

const MaterialSpecsScreen = () => {
  const navigation = useNavigation<MaterialSpecsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MaterialSpecs'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['finish']));
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set(['gloss', 'satin']));
  const [customInput, setCustomInput] = useState('');

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
    const section = SPEC_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  const totalSelectedCount = selectedOptions.size;

  const handleClearAll = () => {
    setSelectedOptions(new Set());
  };

  const handleConfirm = () => {
    // TODO: Save selections to API/state
    // Navigate to next screen in dealer registration flow
    navigation.navigate(SCREENS.AUTH.SELECT_THICKNESS, { profileData });
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      // TODO: Add custom option
      setCustomInput('');
    }
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
          Select Grades & Finishes
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Specify technical attributes for your request. Multiple selections allowed per category.
        </Text>

        {SPEC_SECTIONS.map((section) => {
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
                  <Text variant="bodyMedium" fontWeight="semibold" style={styles.sectionTitle}>
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
                <AppIcon.ChevronDown
                  width={20}
                  height={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>

              {!isExpanded && selectedCount === 0 && (
                <Text variant="captionMedium" style={styles.sectionSubtitle}>
                  Select options
                </Text>
              )}

              {isExpanded && (
                <>
                  <Text variant="captionMedium" style={styles.sectionInstruction}>
                    Select one or more {section.title.toLowerCase()} types.
                  </Text>
                  <View style={styles.optionsGrid}>
                    {section.options.map((option) => {
                      const isSelected = selectedOptions.has(option.id);
                      return (
                        <TouchableOpacity
                          key={option.id}
                          style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                          onPress={() => toggleOption(option.id)}
                          activeOpacity={0.7}
                        >
                          {isSelected && (
                            <AppIcon.TickCheckedBox
                              width={16}
                              height={16}
                              color={theme.colors.text.inverse}
                            />
                          )}
                          <Text
                            variant="bodySmall"
                            fontWeight="medium"
                            style={[
                              styles.optionChipText,
                              isSelected && styles.optionChipTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </Card>
          );
        })}

        <Card style={styles.card}>
          <View style={styles.customInputSection}>
            <View style={styles.customInputLabel}>
              <Text style={{ fontSize: 16 }}>✏️</Text>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.sectionTitle}>
                Can't find what you need?
              </Text>
            </View>
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Type specific grade or finish..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={customInput}
                onChangeText={setCustomInput}
              />
              <TouchableOpacity onPress={handleAddCustom} activeOpacity={0.7} style={styles.addButton}>
                <Text style={{ fontSize: 20, color: theme.colors.primary.DEFAULT }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text variant="bodyMedium" style={styles.footerItemCount}>
            {totalSelectedCount} item{totalSelectedCount !== 1 ? 's' : ''} selected
          </Text>
          {totalSelectedCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7} style={styles.clearAllButton}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.clearAllButtonText}>
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.confirmButtonText}>
            Confirm Selection
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

export default MaterialSpecsScreen;

