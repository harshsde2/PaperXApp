import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import RNFS from 'react-native-fs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { DropdownButton } from '@shared/components/DropdownButton';
import { BottomSheet, IBottomSheetRef } from '@shared/components/BottomSheet';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useDocumentPicker } from '@shared/hooks';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { types } from '@react-native-documents/picker';
import { CompanyDetailsScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

type CompanyDetailsFormData = {
  companyName: string;
  gstin: string;
  state: string;
  city: string;
};

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const CompanyDetailsScreen = () => {
  const navigation = useNavigation<CompanyDetailsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const stateBottomSheetRef = useRef<IBottomSheetRef>(null);

  // Document picker hook - supports PDF and images
  const { isPicking, pickDocument } = useDocumentPicker({
    allowedTypes: [types.images, types.pdf],
    maxSize: 5 * 1024 * 1024, // 5MB
    allowMultiple: false,
  });

  const { control, handleSubmit, formState: { isValid }, setValue, watch } = useForm<CompanyDetailsFormData>({
    defaultValues: {
      companyName: '',
      gstin: '',
      state: '',
      city: '',
    },
    mode: 'onBlur',
  });

  const state = watch('state');

  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    type: string;
    size: number;
    base64: string;
  } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const onSubmit = (data: CompanyDetailsFormData) => {
    navigation.navigate(SCREENS.AUTH.ROLE_SELECTION, {
      companyName: data.companyName.trim(),
      gstIn: data.gstin.trim() || undefined,
      state: data.state.trim() || undefined,
      city: data.city.trim() || undefined,
      udyamCertificateBase64: selectedFile?.base64,
      udyamCertificateName: selectedFile?.name,
      udyamCertificateType: selectedFile?.type,
    });
  };

  const convertFileToBase64 = async (uri: string): Promise<string> => {
    try {
      // Handle different URI formats
      // Android: content:// or file://
      // iOS: file://
      let filePath = uri;
      
      // Remove file:// prefix if present (RNFS needs path without it)
      if (uri.startsWith('file://')) {
        filePath = uri.replace('file://', '');
      } else if (uri.startsWith('content://')) {
        // For content:// URIs on Android, we need to use the URI as-is
        // But RNFS might not support it directly, so we'll try both
        try {
          const base64 = await RNFS.readFile(uri, 'base64');
          return base64;
        } catch {
          // If direct read fails, try without content:// prefix
          filePath = uri;
        }
      }
      
      // Read file and convert to base64
      const base64 = await RNFS.readFile(filePath, 'base64');
      return base64;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw new Error('Failed to process file. Please try selecting the file again.');
    }
  };

  const handleUploadUDYAM = async () => {
    try {
      // Pick document using the hook
      const files = await pickDocument();

      if (!files || files.length === 0) {
        // User cancelled or no valid files
        return;
      }

      const file = files[0];
      setIsConverting(true);

      // Convert file to base64
      const base64 = await convertFileToBase64(file.uri);

      // Store selected file with base64 (not uploaded yet)
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
        base64: base64,
      });
    } catch (error: any) {
      console.error('File selection error:', error);
      Alert.alert('Error', error?.message || 'Failed to process file. Please try again.');
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

  return (
    <View style={{ flex: 1 }}>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
        {/* Business Identity Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <View style={styles.sectionIcon}>
                <AppIcon.Organization width={20} height={20} color={theme.colors.primary.DEFAULT} />
              </View>
            </View>
            <Text
              variant="h4"
              fontWeight="semibold"
              style={styles.sectionTitle}
            >
              Business Identity
            </Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.label}
              >
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
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.label}
              >
                GSTIN
              </Text>
              <Text variant="captionMedium" style={styles.optionalLabel}>
                (Optional)
              </Text>
            </View>
            <FormInput
              name="gstin"
              control={control}
              placeholder="15-DIGIT GST NUMBER"
              maxLength={15}
              rules={validationRules.gstin() as any}
              helperText="Auto-verifies your business type."
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
              showLabel={false}
            />
          </View>
        </Card>

        {/* Location Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <AppIcon.Location
                width={20}
                height={20}
                color={theme.colors.primary.DEFAULT}
              />
            </View>
            <Text
              variant="h4"
              fontWeight="semibold"
              style={styles.sectionTitle}
            >
              Location
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="state"
              rules={validationRules.required('Please select a state') as any}
              render={({ field: { value }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text
                      variant="bodyMedium"
                      fontWeight="medium"
                      style={styles.label}
                    >
                      State
                    </Text>
                  </View>
                  <DropdownButton
                    value={value}
                    placeholder="Select State"
                    onPress={() => {
                      stateBottomSheetRef.current?.open();
                    }}
                  />
                  {error && (
                    <Text variant="captionSmall" style={{ color: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30', marginTop: 4 }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Controller
              control={control}
              name="city"
              rules={validationRules.required('Please enter city') as any}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <View style={styles.labelRow}>
                    <Text
                      variant="bodyMedium"
                      fontWeight="medium"
                      style={styles.label}
                    >
                      City
                    </Text>
                  </View>
                  <View style={styles.searchInputContainer}>
                    <AppIcon.Location
                      width={18}
                      height={18}
                      color={theme.colors.text.tertiary}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={[
                        styles.searchInput,
                        error && {
                          borderColor: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30',
                        },
                      ]}
                      placeholder="Search City"
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                  {error && (
                    <Text variant="captionSmall" style={{ color: (theme.colors.error as any)?.DEFAULT || theme.colors.error?.[500] || '#FF3B30', marginTop: 4 }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </Card>

        {/* Verification Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <View style={styles.shieldIcon}>
                <Text style={styles.shieldIconText}>🛡️</Text>
              </View>
            </View>
            <Text
              variant="h4"
              fontWeight="semibold"
              style={styles.sectionTitle}
            >
              Verification
            </Text>
            <View style={styles.trustBadge}>
              <Text
                variant="captionSmall"
                fontWeight="semibold"
                style={styles.trustBadgeText}
              >
                High Trust
              </Text>
            </View>
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
                    <AppIcon.Organization
                      width={40}
                      height={40}
                      color={theme.colors.primary.DEFAULT}
                    />
                    <Text variant="captionSmall" style={styles.pdfLabel}>
                      PDF
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.fileInfo}>
                  <Text
                    variant="bodyMedium"
                    fontWeight="medium"
                    style={styles.fileName}
                    numberOfLines={1}
                  >
                    {selectedFile.name}
                  </Text>
                  <Text variant="captionSmall" style={styles.fileSize}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleRemoveFile}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.uploadContainer,
                (isPicking || isConverting) && styles.uploadContainerDisabled,
              ]}
              onPress={handleUploadUDYAM}
              activeOpacity={0.7}
              disabled={isPicking || isConverting}
            >
              {(isPicking || isConverting) ? (
                <ActivityIndicator color={theme.colors.primary.DEFAULT} size="small" />
              ) : (
                <>
                  <View style={styles.uploadIconContainer}>
                    <Text style={styles.uploadIcon}>☁️</Text>
                  </View>
                  <Text
                    variant="bodyMedium"
                    fontWeight="medium"
                    style={styles.uploadText}
                  >
                    Select UDYAM Certificate
                  </Text>
                  <Text variant="captionSmall" style={styles.uploadSubtext}>
                    PDF or JPG (Max 5MB)
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* File Preview Modal */}
          <Modal
            visible={previewVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPreviewVisible(false)}
          >
            <View style={styles.previewModalContainer}>
              <View style={styles.previewModalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPreviewVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                {isImage && selectedFile && (
                  <Image
                    source={{ uri: selectedFile.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                )}
                {isPdf && selectedFile && (
                  <View style={styles.previewPdfContainer}>
                    <AppIcon.Organization
                      width={80}
                      height={80}
                      color={theme.colors.primary.DEFAULT}
                    />
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

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text variant="captionSmall" style={styles.infoText}>
              Uploading a valid certificate increases your profile trust score
              and matchmaking priority.
            </Text>
          </View>
        </Card>

        {/* Save & Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
            Save & Continue
          </Text>
          <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text variant="captionSmall" style={styles.securityText}>
            YOUR DATA IS ENCRYPTED & SECURE
          </Text>
        </View>
      </View>
      </ScreenWrapper>

      {/* State Selection BottomSheet - Outside ScreenWrapper for proper positioning */}
      <BottomSheet
        ref={stateBottomSheetRef}
        snapPoints={['70%', '95%']}
        initialSnapIndex={0}
        enableDrag={true}
        enableBackdropPress={true}
        backdropOpacity={0.5}
        onClose={() => console.log('State selection closed')}
      >
        <View style={{ flex: 1 }}>
          <Text
            variant="h4"
            fontWeight="semibold"
            style={styles.bottomSheetTitle}
          >
            Select State
          </Text>
          <FlatList
            data={INDIAN_STATES}
            keyExtractor={(item) => item}
            style={{ flex: 1 }}
            contentContainerStyle={styles.bottomSheetListContent}
            nestedScrollEnabled={true}
            bounces={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stateItem,
                  state === item && styles.stateItemSelected,
                ]}
                onPress={() => {
                  setValue('state', item);
                  stateBottomSheetRef.current?.close();
                }}
                activeOpacity={0.7}
              >
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.stateItemText,
                    state === item && styles.stateItemTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {state === item && (
                  <AppIcon.TickCheckedBox
                    width={20}
                    height={20}
                    color={theme.colors.primary.DEFAULT}
                  />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default CompanyDetailsScreen;
