import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import { MillBrandDetailsScreenNavigationProp, MillRelationship } from './@types';
import { createStyles } from './styles';

const MillBrandDetailsScreen = () => {
  const navigation = useNavigation<MillBrandDetailsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [millBrandName, setMillBrandName] = useState('');
  const [preferNotToDisclose, setPreferNotToDisclose] = useState(false);
  const [relationship, setRelationship] = useState<MillRelationship>('authorized-agent');

  const handleNextStep = () => {
    // TODO: Save data and navigate to next screen
    navigation.navigate(SCREENS.AUTH.MATERIAL_SPECS);
  };

  const handleAddManually = () => {
    // TODO: Open manual add modal/screen
  };

  const relationshipOptions = [
    {
      id: 'authorized-agent' as MillRelationship,
      label: 'Authorized Agent (Direct)',
      subtext: 'I have a direct contract with the manufacturer',
    },
    {
      id: 'independent-dealer' as MillRelationship,
      label: 'Independent Dealer / Reseller',
      subtext: 'I buy through channels or secondary markets',
    },
  ];

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text variant="bodyMedium" style={styles.description}>
          Please specify the origin of the materials you are listing. accurate sourcing helps us match you with the right buyers.
        </Text>

        <Card style={styles.card}>
          <View style={styles.formGroup}>
            <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
              Mill / Brand Name
            </Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>🔍</Text>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Start typing to search..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={millBrandName}
                onChangeText={setMillBrandName}
              />
              <AppIcon.ChevronDown
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
            </View>
            <TouchableOpacity onPress={handleAddManually} activeOpacity={0.7}>
              <Text variant="bodySmall" style={styles.manualAddLinkText}>
                Can't find it? Add manually
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.disclosureContainer}
            onPress={() => setPreferNotToDisclose(!preferNotToDisclose)}
            activeOpacity={0.7}
          >
            {preferNotToDisclose ? (
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
            <View style={styles.disclosureTextContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.disclosureText}>
                I prefer not to disclose the mill name
              </Text>
              <Text variant="captionSmall" style={styles.disclosureSubtext}>
                This may reduce matchmaking accuracy slightly.
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <View style={styles.relationshipSection}>
            <Text variant="bodyMedium" fontWeight="medium" style={styles.relationshipTitle}>
              What is your relationship with this mill?
            </Text>
            {relationshipOptions.map((option) => {
              const isSelected = relationship === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.relationshipCard, isSelected && styles.relationshipCardSelected]}
                  onPress={() => setRelationship(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.relationshipLeft}>
                    <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <View style={styles.relationshipContent}>
                      <Text variant="bodyMedium" fontWeight="medium" style={styles.relationshipLabel}>
                        {option.label}
                      </Text>
                      <Text variant="captionMedium" style={styles.relationshipSubtext}>
                        {option.subtext}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNextStep}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
            Next Step
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

export default MillBrandDetailsScreen;

