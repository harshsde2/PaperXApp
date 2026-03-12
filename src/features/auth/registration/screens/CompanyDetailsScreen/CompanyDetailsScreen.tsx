import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  InteractionManager,
} from 'react-native';
import { Toast } from 'toastify-react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import RNFS from 'react-native-fs';
import { State, City, ICity } from 'country-state-city';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { CustomButton } from '@shared/components/CustomButton';
import { DropdownButton } from '@shared/components/DropdownButton';
import { StateSelectionContent } from '@shared/components/StateSelectionContent';
import { CitySelectionContent } from '@shared/components/CitySelectionContent';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useDocumentPicker } from '@shared/hooks';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { types } from '@react-native-documents/picker';
import {
  CompanyDetailsScreenNavigationProp,
  CompanyDetailsFormData,
  SelectedFile,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

const INDIA_COUNTRY_CODE = 'IN';
const INDIAN_STATES = State.getStatesOfCountry(INDIA_COUNTRY_CODE);

const STATE_NAME_TO_ISO: Record<string, string> = {};
INDIAN_STATES.forEach((s) => {
  STATE_NAME_TO_ISO[s.name] = s.isoCode;
});

const CITIES_CACHE: Record<string, ICity[]> = {};

const getCitiesForState = (stateIsoCode: string): ICity[] => {
  if (!stateIsoCode) return [];
  if (!CITIES_CACHE[stateIsoCode]) {
    CITIES_CACHE[stateIsoCode] = City.getCitiesOfState(INDIA_COUNTRY_CODE, stateIsoCode);
  }
  return CITIES_CACHE[stateIsoCode];
};

const CompanyDetailsScreen = () => {
  const navigation = useNavigation<CompanyDetailsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const stateSheetRef = useRef<BottomSheetModal>(null);
  const citySheetRef = useRef<BottomSheetModal>(null);

  const { isPicking, pickDocument } = useDocumentPicker({
    allowedTypes: [types.images, types.pdf],
    maxSize: 5 * 1024 * 1024,
    allowMultiple: false,
  });

  const { control, handleSubmit, setValue, watch } = useForm<CompanyDetailsFormData>({
    defaultValues: {
      companyName: '',
      gstin: '928627527846124',
      state: '',
      city: '',
      udyamCertificateNumber: '911234567890',
    },
    mode: 'onBlur',
  });

  const selectedStateName = watch('state');
  const selectedCityName = watch('city');
  const selectedStateIso = STATE_NAME_TO_ISO[selectedStateName] || '';

  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const handleStateSelect = useCallback(
    (stateName: string) => {
      stateSheetRef.current?.dismiss();
      InteractionManager.runAfterInteractions(() => {
        setValue('state', stateName);
        setValue('city', '');
        setStateSearchQuery('');
      });
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (cityName: string) => {
      citySheetRef.current?.dismiss();
      InteractionManager.runAfterInteractions(() => {
        setValue('city', cityName);
      });
    },
    [setValue]
  );

  const openStateSelector = useCallback(() => {
    setStateSearchQuery('');
    stateSheetRef.current?.present();
  }, []);

  const openCitySelector = useCallback(() => {
    if (!selectedStateName) {
      Toast.show({
        type: 'info',
        text1: 'Select State',
        text2: 'Please select a state first',
        position: 'top',
      });
      return;
    }
    citySheetRef.current?.present();
  }, [selectedStateName]);

  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const onInvalid = useCallback(
    (errors: Record<string, { message?: string }>) => {
      const firstError = Object.values(errors)[0];
      const message = firstError?.message || 'Please check the form and try again.';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: message,
        position: 'top',
      });
    },
    []
  );

  const onSubmit = (data: CompanyDetailsFormData) => {
    navigation.navigate(SCREENS.AUTH.ROLE_SELECTION, {
      companyName: data.companyName.trim(),
      gstIn: data.gstin.trim() || undefined,
      state: data.state.trim() || undefined,
      city: data.city.trim() || undefined,
      udyamCertificateNumber: data.udyamCertificateNumber?.trim() || undefined,
      udyamCertificateBase64: selectedFile?.base64,
      udyamCertificateName: selectedFile?.name,
      udyamCertificateType: selectedFile?.type,
    });
  };

  const convertFileToBase64 = async (uri: string): Promise<string> => {
    try {
      let filePath = uri;

      if (uri.startsWith('file://')) {
        filePath = uri.replace('file://', '');
      } else if (uri.startsWith('content://')) {
        try {
          const base64 = await RNFS.readFile(uri, 'base64');
          return base64;
        } catch {
          filePath = uri;
        }
      }

      const base64 = await RNFS.readFile(filePath, 'base64');
      return base64;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw new Error('Failed to process file. Please try selecting the file again.');
    }
  };

  const handleUploadUDYAM = async () => {
    try {
      const files = await pickDocument();
      if (!files || files.length === 0) return;

      const file = files[0];
      setIsConverting(true);

      const base64 = await convertFileToBase64(file.uri);
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
        base64: base64,
      });
    } catch (error: any) {
      console.error('File selection error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to process file. Please try again.',
        position: 'top',
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleViewFile = () => {
    if (selectedFile) {
      setPreviewVisible(true);
    }
  };

  const handleRemoveFile = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSelectedFile(null);
          },
        },
      ]
    );
  };

  const isImage = selectedFile?.type?.startsWith('image/');
  const isPdf = selectedFile?.type === 'application/pdf' || selectedFile?.name?.toLowerCase().endsWith('.pdf');

  const citiesForState = getCitiesForState(selectedStateIso);

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <ScreenWrapper
          scrollable
          backgroundColor={theme.colors.background.secondary}
          safeAreaEdges={[]}
          contentContainerStyle={styles.scrollContent}
          scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        >
          <View style={styles.container}>
          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <View style={styles.sectionIcon}>
                  <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
                </View>
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Business Identity
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  Company Name
                </Text>
              </View>
              <FormInput
                name="companyName"
                control={control}
                placeholder="e.g. Apex Packaging Solutions"
                rules={validationRules.required('Please enter company name') as any}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
                showError={false}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  GSTIN
                </Text>
                <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary }}>
                  (Optional)
                </Text>
              </View>
              <FormInput
                name="gstin"
                control={control}
                placeholder="15-DIGIT GST NUMBER"
                maxLength={15}
                rules={{
                  validate: (value: string) => {
                    const normalizedValue = value?.trim() || '';
                    if (!normalizedValue) return true;
                    return /^[0-9A-Z]{15}$/.test(normalizedValue) || 'Please enter a valid 15-digit GSTIN';
                  },
                } as any}
                helperText="Auto-verifies your business type."
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
                showError={false}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <AppIcon.Location width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Location
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="state"
                rules={validationRules.required('Please select a state') as any}
                render={({ field: { value } }) => (
                  <>
                    <View style={styles.labelRow}>
                      <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                        State
                      </Text>
                    </View>
                    <DropdownButton
                      value={value}
                      placeholder="Select State"
                      onPress={openStateSelector}
                    />
                  </>
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="city"
                rules={validationRules.required('Please select a city') as any}
                render={({ field: { value } }) => (
                  <>
                    <View style={styles.labelRow}>
                      <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                        City
                      </Text>
                    </View>
                    <DropdownButton
                      value={value}
                      placeholder={selectedStateName ? 'Select City' : 'Select State first'}
                      onPress={openCitySelector}
                      disabled={!selectedStateName}
                    />
                  </>
                )}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <View style={styles.shieldIcon}>
                  <Text style={styles.shieldIconText}>🛡️</Text>
                </View>
              </View>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
                Verification
              </Text>
              {/* <View style={styles.trustBadge}>
                <Text variant="captionSmall" fontWeight="semibold" style={styles.trustBadgeText}>
                  High Trust
                </Text>
              </View> */}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  UDYAM Certificate Number
                </Text>
                <Text variant="captionSmall" style={{ color: theme.colors.text.tertiary }}>
                  (Optional)
                </Text>
              </View>
              <FormInput
                name="udyamCertificateNumber"
                control={control}
                placeholder="Enter UDYAM Certificate Number"
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                showLabel={false}
                showError={false}
              />
            </View>
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text variant="captionSmall" style={styles.orText}>Or</Text>
              <View style={styles.orLine} />
            </View>

            {selectedFile ? (
              <View style={styles.uploadedFileContainer}>
                <View style={styles.uploadedFileInfo}>
                  {isImage && (
                    <TouchableOpacity onPress={handleViewFile} activeOpacity={0.7}>
                      <Image
                        source={{ uri: selectedFile.uri }}
                        style={styles.filePreviewImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  {isPdf && (
                    <TouchableOpacity
                      style={styles.filePreviewPdf}
                      onPress={handleViewFile}
                      activeOpacity={0.7}
                    >
                      <AppIcon.Organization width={40} height={40} color={theme.colors.primary.DEFAULT} />
                      <Text variant="captionSmall" style={styles.pdfLabel}>
                        PDF
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.fileInfo}>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.fileName} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text variant="captionSmall" style={styles.fileSize}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={handleRemoveFile} activeOpacity={0.7}>
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.uploadContainer, (isPicking || isConverting) && styles.uploadContainerDisabled]}
                onPress={handleUploadUDYAM}
                activeOpacity={0.7}
                disabled={isPicking || isConverting}
              >
                {isPicking || isConverting ? (
                  <ActivityIndicator color={theme.colors.primary.DEFAULT} size="small" />
                ) : (
                  <>
                    <View style={styles.uploadIconContainer}>
                      <Text style={styles.uploadIcon}>☁️</Text>
                    </View>
                    <Text variant="bodyMedium" fontWeight="medium" style={styles.uploadText}>
                      Select UDYAM Certificate
                    </Text>
                    <Text variant="captionSmall" style={styles.uploadSubtext}>
                      PDF or JPG (Max 5MB)
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <Modal
              visible={previewVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setPreviewVisible(false)}
            >
              <View style={styles.previewModalContainer}>
                <View style={styles.previewModalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setPreviewVisible(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  {isImage && selectedFile && (
                    <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} resizeMode="contain" />
                  )}
                  {isPdf && selectedFile && (
                    <View style={styles.previewPdfContainer}>
                      <AppIcon.Organization width={80} height={80} color={theme.colors.primary.DEFAULT} />
                      <Text variant="h4" fontWeight="semibold" style={styles.previewPdfTitle}>
                        {selectedFile.name}
                      </Text>
                      <Text variant="bodyMedium" style={styles.previewPdfText}>
                        PDF Document
                      </Text>
                      <Text variant="captionSmall" style={styles.previewPdfSize}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Modal>

            {/* <View style={styles.infoContainer}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text variant="captionSmall" style={styles.infoText}>
                Uploading a valid certificate increases your profile trust score and matchmaking priority.
              </Text>
            </View> */}
          </Card>

          <CustomButton
            title="Save & Continue"
            onPress={() => handleSubmit(onSubmit, onInvalid)()}
            variant="gradient"
            size="md"
            fullWidth
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={
              <AppIcon.ArrowRight
                width={20}
                height={20}
                color={theme.colors.text.inverse}
              />
            }
          />
        </View>
      </ScreenWrapper>

      <BottomSheetModal
        ref={stateSheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        onDismiss={() => setStateSearchQuery('')}
      >
        <StateSelectionContent
          searchQuery={stateSearchQuery}
          onSearchChange={setStateSearchQuery}
          selectedState={selectedStateName}
          onSelect={handleStateSelect}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={citySheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
      >
        <CitySelectionContent
          selectedCity={selectedCityName}
          selectedStateName={selectedStateName}
          cities={citiesForState}
          onSelect={handleCitySelect}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </BottomSheetModal>
    </View>
    </BottomSheetModalProvider>
  );
};

export default CompanyDetailsScreen;
