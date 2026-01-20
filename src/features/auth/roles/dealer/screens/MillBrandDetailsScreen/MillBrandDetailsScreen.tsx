import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, InteractionManager } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { DropdownButton } from '@shared/components/DropdownButton';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { useBottomSheet } from '@shared/components/BottomSheet';
import {
  BrandSelectionContent,
  SelectedBrand,
} from '@shared/components/BrandSelectionContent';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import {
  MillBrandDetailsScreenNavigationProp,
  MillRelationship,
} from './@types';
import { createStyles } from './styles';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useGetBrands } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appContent } from '@utils/appContent';

const MillBrandDetailsScreen = () => {
  const navigation = useNavigation<MillBrandDetailsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MillBrandDetails'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const bottomSheet = useBottomSheet();

  // Get params from route
  const {  onBrandDetailsSelected, materialKey } = route.params || {};

  // Fetch brands from API
  const { data: brands = [], isLoading, isError, refetch } = useGetBrands();

  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(
    null,
  );
  const [preferNotToDisclose, setPreferNotToDisclose] = useState(false);
  const [relationship, setRelationship] =
    useState<MillRelationship>('authorized-agent');

  const handleBrandSelect = useCallback(
    (brand: SelectedBrand) => {
      bottomSheet.close();
      InteractionManager.runAfterInteractions(() => {
        setSelectedBrand(brand);
        setBrandSearchQuery('');
      });
    },
    [bottomSheet],
  );

  const openBrandSelector = useCallback(() => {
    if (preferNotToDisclose) return;

    setBrandSearchQuery('');
    bottomSheet.open(
      <BrandSelectionContent
        searchQuery={brandSearchQuery}
        onSearchChange={setBrandSearchQuery}
        selectedBrand={selectedBrand}
        brands={brands}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onSelect={handleBrandSelect}
        theme={theme}
      />,
      {
        snapPoints: ['70%', '95%'],
        initialSnapIndex: 0,
        onClose: () => setBrandSearchQuery(''),
      },
    );
  }, [
    bottomSheet,
    brandSearchQuery,
    selectedBrand,
    brands,
    isLoading,
    isError,
    refetch,
    handleBrandSelect,
    theme,
    preferNotToDisclose,
  ]);

  const handlePreferNotToDisclose = (value: boolean) => {
    setPreferNotToDisclose(value);
    if (value) {
      setSelectedBrand(null);
    }
  };

  const handleNextStep = () => {
    // Map relationship to agent_type for API
    const agentTypeMap: Record<MillRelationship, string> = {
      'authorized-agent': 'AUTHORIZED_AGENT',
      'independent-dealer': 'INDEPENDENT_DEALER',
    };
    
    const brandDetails = {
      brand_id: preferNotToDisclose ? null : selectedBrand?.id || null,
      agent_type: preferNotToDisclose ? null : agentTypeMap[relationship] || null,
    };

    if (onBrandDetailsSelected) {
      // Called from Materials screen via callback (after specs selection)
      onBrandDetailsSelected(brandDetails);
      // Close all 3 modals (SelectThickness, MaterialSpecs, MillBrandDetails) and return to MaterialsScreen
      if (navigation.canGoBack()) {
        navigation.pop(3);
      } else {
        navigation.goBack();
      }
      return;
    }

    // Fallback: existing flow if no callback is provided
    navigation.goBack();
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

  const canProceed = preferNotToDisclose || selectedBrand !== null;

  // Calculate bottom padding for scrollable content
  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentStyle={{ ...styles.scrollContent, paddingBottom: bottomPadding }}
      >
        <View style={styles.container}>
          <Text variant="bodyMedium" style={styles.description}>
            {appContent.MillBrandDetails.Subheadline}
          </Text>

          <Card style={styles.card}>
            <View style={styles.formGroup}>
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.label}
              >
                Mill / Brand Name
              </Text>
              <DropdownButton
                value={selectedBrand?.name || ''}
                placeholder="Select Mill / Brand"
                onPress={openBrandSelector}
                style={{ opacity: preferNotToDisclose ? 0.5 : 1 }}
                disabled={preferNotToDisclose}
              />
              <TouchableOpacity
                onPress={() => {
                  // For manual entry, user can still open the selector
                  // and type in the search to find or add a brand
                  if (!preferNotToDisclose) {
                    openBrandSelector();
                  }
                }}
                activeOpacity={0.7}
                disabled={preferNotToDisclose}
              >
                <Text
                  variant="bodySmall"
                  style={[
                    styles.manualAddLinkText,
                    preferNotToDisclose && { opacity: 0.5 },
                  ]}
                >
                  Can't find it? Add manually
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card style={styles.card}>
            <TouchableOpacity
              style={styles.disclosureContainer}
              onPress={() => handlePreferNotToDisclose(!preferNotToDisclose)}
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
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.disclosureText}
                >
                  I prefer not to disclose the mill name
                </Text>
                {/* <Text variant="captionSmall" style={styles.disclosureSubtext}>
                  This may reduce matchmaking accuracy slightly.
                </Text> */}
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={[styles.card,{opacity: preferNotToDisclose ? 0.5 : 1}]}>
            <View style={styles.relationshipSection}>
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.relationshipTitle}
              >
                What is your relationship with this mill?
              </Text>
              {relationshipOptions.map(option => {
                const isSelected = relationship === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.relationshipCard,
                      isSelected && styles.relationshipCardSelected,
                    ]}
                    onPress={() => setRelationship(option.id)}
                    activeOpacity={0.7}
                    disabled={preferNotToDisclose}
                  >
                    <View style={styles.relationshipLeft}>
                      <View
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                      <View style={styles.relationshipContent}>
                        <Text
                          variant="bodyMedium"
                          fontWeight="medium"
                          style={styles.relationshipLabel}
                        >
                          {option.label}
                        </Text>
                        <Text
                          variant="captionMedium"
                          style={styles.relationshipSubtext}
                        >
                          {option.subtext}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>
      </ScreenWrapper>

      {/* Floating Bottom Button */}
      <FloatingBottomContainer>
        <TouchableOpacity
          style={[styles.button, !canProceed && { opacity: 0.5 }]}
          onPress={handleNextStep}
          activeOpacity={0.8}
          disabled={!canProceed}
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
      </FloatingBottomContainer>
    </>
  );
};

export default MillBrandDetailsScreen;
