import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import { MaterialsScreenNavigationProp, MaterialItem, MaterialCategory } from './@types';
import { createStyles } from './styles';

const MATERIALS_DATA: MaterialCategory[] = [
  {
    id: 'paper',
    name: 'PAPER GRADES',
    type: 'paper',
    items: [
      { id: 'kraft-paper', name: 'Kraft Paper', subtitle: 'Industrial Packaging', category: 'paper' },
      { id: 'duplex-board', name: 'Duplex Board', subtitle: 'Box Making', category: 'paper' },
    ],
  },
  {
    id: 'machinery',
    name: 'MACHINERY',
    type: 'machinery',
    items: [
      { id: 'corrugated-machinery', name: 'Corrugated Machinery', subtitle: 'Heavy Equipment', category: 'machinery' },
      { id: 'offset-printers', name: 'Offset Printers', subtitle: 'Printing Press', category: 'machinery' },
    ],
  },
];

const MaterialsScreen = () => {
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(
    new Set(['kraft-paper', 'offset-printers'])
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return MATERIALS_DATA;
    }

    const query = searchQuery.toLowerCase();
    return MATERIALS_DATA.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
      ),
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const handleMaterialToggle = (materialId: string) => {
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

  const getMaterialById = (id: string): MaterialItem | undefined => {
    for (const category of MATERIALS_DATA) {
      const item = category.items.find(item => item.id === id);
      if (item) return item;
    }
    return undefined;
  };

  const selectedMaterialsList = Array.from(selectedMaterials)
    .map(id => getMaterialById(id))
    .filter((item): item is MaterialItem => item !== undefined);

  const handleSaveAndContinue = () => {
    // TODO: Save selected materials and navigate to next screen
    navigation.navigate(SCREENS.AUTH.MILL_BRAND_DETAILS);
  };

  const progressPercentage = 25;
  const currentStep = 1;
  const totalSteps = 4;

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
    
        <Text variant="h3" fontWeight="bold" style={styles.title}>
          What materials do you deal in?
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          Select the specific grades of paper, machinery, or packaging materials you buy or sell to get better matches.
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>🔍</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search materials (e.g., Duplex Board)"
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {selectedMaterialsList.length > 0 && (
          <View style={styles.selectedChipsContainer}>
            {selectedMaterialsList.map(material => (
              <TouchableOpacity
                key={material.id}
                style={styles.chip}
                onPress={() => handleRemoveChip(material.id)}
                activeOpacity={0.8}
              >
                <Text variant="bodySmall" fontWeight="medium" style={styles.chipText}>
                  {material.name}
                </Text>
                <Text style={styles.chipText}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredCategories.map(category => (
          <View key={category.id} style={styles.categorySection}>
            <Text variant="captionMedium" fontWeight="semibold" style={styles.categoryHeader}>
              {category.name}
            </Text>
            {category.items.map(item => {
              const isSelected = selectedMaterials.has(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.materialItem}
                  onPress={() => handleMaterialToggle(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.materialItemContent}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.materialItemName}>
                      {item.name}
                    </Text>
                    <Text variant="captionMedium" style={styles.materialItemSubtitle}>
                      {item.subtitle}
                    </Text>
                  </View>
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
                      color={theme.colors.text.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveAndContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
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

export default MaterialsScreen;

