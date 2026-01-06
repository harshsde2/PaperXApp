import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useDocumentPicker } from '@shared/hooks';
import { types } from '@react-native-documents/picker';
import { CompanyDetailsScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

const CompanyDetailsScreen = () => {
  const navigation = useNavigation<CompanyDetailsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  // Document picker hook - supports PDF and images
  const { isPicking, pickDocument } = useDocumentPicker({
    allowedTypes: [types.images, types.pdf],
    maxSize: 5 * 1024 * 1024, // 5MB
    allowMultiple: false,
  });

  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    type: string;
    size: number;
    base64: string;
  } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleSaveAndContinue = () => {
    if (!companyName.trim()) {
      Alert.alert('Error', 'Please enter company name');
      return;
    }
    // Pass collected data including base64 file to RoleSelection screen
    navigation.navigate(SCREENS.AUTH.ROLE_SELECTION, {
      companyName: companyName.trim(),
      gstIn: gstin.trim() || undefined,
      state: state.trim() || undefined,
      city: city.trim() || undefined,
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
            <TextInput
              style={styles.input}
              placeholder="e.g. Apex Packaging Solutions"
              placeholderTextColor={theme.colors.text.tertiary}
              value={companyName}
              onChangeText={setCompanyName}
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
            <TextInput
              style={styles.input}
              placeholder="15-DIGIT GST NUMBER"
              placeholderTextColor={theme.colors.text.tertiary}
              value={gstin}
              onChangeText={setGstin}
              maxLength={15}
            />
            <Text variant="captionSmall" style={styles.helperText}>
              Auto-verifies your business type.
            </Text>
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
            <View style={styles.labelRow}>
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.label}
              >
                State
              </Text>
            </View>
            <TouchableOpacity style={styles.dropdownInput}>
              <Text
                style={[
                  styles.dropdownText,
                  !state && styles.dropdownPlaceholder,
                ]}
              >
                {state || 'Select State'}
              </Text>
              <AppIcon.ChevronDown
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
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
                style={styles.searchInput}
                placeholder="Search City"
                placeholderTextColor={theme.colors.text.tertiary}
                value={city}
                onChangeText={setCity}
              />
            </View>
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
          onPress={handleSaveAndContinue}
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
  );
};

export default CompanyDetailsScreen;
