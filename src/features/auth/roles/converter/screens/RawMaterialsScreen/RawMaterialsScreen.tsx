import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { RawMaterialsScreenNavigationProp, RawMaterialSection } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const RAW_MATERIAL_SECTIONS: RawMaterialSection[] = [
  {
    id: 'paper-board',
    title: 'Paper & Board',
    options: [
      { id: 'testliner', label: 'Testliner' },
      { id: 'fluting-medium', label: 'Fluting Medium' },
      { id: 'duplex-board', label: 'Duplex Board' },
      { id: 'virgin-kraft', label: 'Virgin Kraft' },
    ],
  },
  {
    id: 'polymers-films',
    title: 'Polymers & Films',
    options: [
      { id: 'ldpe-granules', label: 'LDPE Granules' },
      { id: 'bopp-film', label: 'BOPP Film' },
    ],
  },
  {
    id: 'inks-chemicals',
    title: 'Inks & Chemicals',
    options: [],
  },
];

const RawMaterialsScreen = () => {
  const navigation = useNavigation<RawMaterialsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'RawMaterials'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['paper-board', 'polymers-films'])
  );
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(
    new Set(['duplex-board', 'virgin-kraft'])
  );

  const currentStep = 4;
  const totalSteps = 6;

  const getAllMaterials = () => {
    const allMaterials: Array<{ id: string; label: string; sectionId: string }> = [];
    RAW_MATERIAL_SECTIONS.forEach(section => {
      section.options.forEach(option => {
        allMaterials.push({ ...option, sectionId: section.id });
      });
    });
    return allMaterials;
  };

  const getMaterialById = (id: string) => {
    return getAllMaterials().find(m => m.id === id);
  };

  const selectedMaterialsList = Array.from(selectedMaterials)
    .map(id => getMaterialById(id))
    .filter((item): item is { id: string; label: string; sectionId: string } => item !== undefined);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return RAW_MATERIAL_SECTIONS;
    }

    const query = searchQuery.toLowerCase();
    return RAW_MATERIAL_SECTIONS.map(section => ({
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

  const toggleMaterial = (materialId: string) => {
    const newSelected = new Set(selectedMaterials);
    if (newSelected.has(materialId)) {
      newSelected.delete(materialId);
    } else {
      newSelected.add(materialId);
    }
    setSelectedMaterials(newSelected);
  };

  const handleRemoveChip = (materialId: string) => {
    const newSelected = new Set(selectedMaterials);
    newSelected.delete(materialId);
    setSelectedMaterials(newSelected);
  };

  const handleContinue = () => {
    // TODO: Save selections to API/state
    // Navigate to next screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.FACTORY_LOCATION, { profileData });
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
          Raw Materials Used
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Select all materials you currently buy. This helps us match you with relevant mills and traders.
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
            placeholder="Search materials (e.g., Kraft, LDPE)..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Selected Materials Chips */}
        {selectedMaterialsList.length > 0 && (
          <View style={styles.chipsContainer}>
            {selectedMaterialsList.map(material => (
              <TouchableOpacity
                key={material.id}
                style={styles.chip}
                onPress={() => handleRemoveChip(material.id)}
                activeOpacity={0.8}
              >
                <Text variant="bodySmall" fontWeight="medium" style={styles.chipText}>
                  {material.label}
                </Text>
                <Text style={styles.chipClose}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Suggested Materials Section */}
        <Text variant="h6" fontWeight="bold" style={styles.sectionHeader}>
          SUGGESTED MATERIALS
        </Text>

        {/* Material Categories */}
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);

          return (
            <Card key={section.id} style={styles.card}>
              <TouchableOpacity
                style={styles.sectionHeaderButton}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <Text variant="h6" fontWeight="semibold" style={styles.sectionTitle}>
                  {section.title}
                </Text>
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
                    const isSelected = selectedMaterials.has(option.id);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.optionRow}
                        onPress={() => toggleMaterial(option.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
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
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
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

export default RawMaterialsScreen;

