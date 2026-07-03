import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, InteractionManager, Modal, TextInput } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { DropdownButton } from '@shared/components/DropdownButton';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
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
import { useGetBrands, useCreateBrand } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appContent } from '@utils/appContent';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';

const MillBrandDetailsScreen = () => {
  const navigation = useNavigation<MillBrandDetailsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MillBrandDetails'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const brandSheetRef = useRef<BottomSheetModal>(null);

  // Get params from route
  const {  onBrandDetailsSelected, materialKey } = route.params || {};

  // Fetch brands from API
  const { data: brands = [], isLoading, isError, refetch } = useGetBrands();
  const { mutateAsync: createBrand, isPending: isAddingBrand } = useCreateBrand();

  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [isCustomBrandModalVisible, setIsCustomBrandModalVisible] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(
    null,
  );
  const [preferNotToDisclose, setPreferNotToDisclose] = useState(false);
  const [relationship, setRelationship] =
    useState<MillRelationship>('authorized-agent');

  const handleBrandSelect = useCallback(
    (brand: SelectedBrand) => {
      brandSheetRef.current?.dismiss();
      InteractionManager.runAfterInteractions(() => {
        setSelectedBrand(brand);
        setBrandSearchQuery('');
      });
    },
    [],
  );

  const openBrandSelector = useCallback(() => {
    if (preferNotToDisclose) return;
    setBrandSearchQuery('');
    brandSheetRef.current?.present();
  }, [preferNotToDisclose]);

  const openCustomBrandModal = useCallback(() => {
    if (preferNotToDisclose) return;
    setCustomBrandName('');
    setIsCustomBrandModalVisible(true);
  }, [preferNotToDisclose]);

  const handleAddCustomBrand = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        dispatch(showToast({ message: 'Please enter a brand name', type: 'error' }));
        return;
      }
      try {
        const brand = await createBrand({ name: trimmed });
        if (brand?.id) {
          brandSheetRef.current?.dismiss();
          setIsCustomBrandModalVisible(false);
          setCustomBrandName('');
          InteractionManager.runAfterInteractions(() => {
            setSelectedBrand({ id: brand.id, name: brand.name });
            setBrandSearchQuery('');
          });
          dispatch(showToast({ message: 'Brand added successfully', type: 'success' }));
        } else {
          dispatch(showToast({ message: 'Failed to add brand', type: 'error' }));
        }
      } catch (error: any) {
        const msg =
          error?.response?.data?.message || error?.message || 'Failed to add brand';
        dispatch(showToast({ message: msg, type: 'error' }));
      }
    },
    [createBrand, dispatch],
  );

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
      brand_name: preferNotToDisclose ? null : selectedBrand?.name ?? null,
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
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
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
                onPress={openCustomBrandModal}
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
        <CustomButton
          title="Next Step"
          onPress={handleNextStep}
          variant="gradient"
          size="md"
          disabled={!canProceed}
          gradientColors={[
            theme.colors.primary[400],
            theme.colors.primary[600],
            theme.colors.primary.DEFAULT,
          ]}
          gradientStart={{ x: 0, y: 0 }}
          gradientEnd={{ x: 1, y: 1 }}
          rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
        />
      </FloatingBottomContainer>

      <Modal
        visible={isCustomBrandModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCustomBrandModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
              Add Mill / Brand
            </Text>
            <TextInput
              style={styles.customBrandInput}
              placeholder="Enter mill / brand name"
              placeholderTextColor={theme.colors.text.tertiary}
              value={customBrandName}
              onChangeText={setCustomBrandName}
              editable={!isAddingBrand}
              autoFocus
            />
            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                onPress={() => setIsCustomBrandModalVisible(false)}
                variant="outline"
                size="md"
                style={styles.modalCancelButton}
              />
              <CustomButton
                title="Add"
                onPress={() => handleAddCustomBrand(customBrandName)}
                variant="gradient"
                size="md"
                loading={isAddingBrand}
                disabled={isAddingBrand || !customBrandName.trim()}
                gradientColors={[
                  theme.colors.primary[400],
                  theme.colors.primary.DEFAULT,
                ]}
                gradientStart={{ x: 0, y: 0 }}
                gradientEnd={{ x: 1, y: 1 }}
                style={styles.addBrandButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <GorhomBottomSheetModal
        ref={brandSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setBrandSearchQuery('')}
      >
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
          ListComponent={BottomSheetFlatList}
          onAddCustom={handleAddCustomBrand}
          isAddingCustom={isAddingBrand}
        />
      </GorhomBottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default MillBrandDetailsScreen;
