import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { CompanyDetailsScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

const CompanyDetailsScreen = () => {
  const navigation = useNavigation<CompanyDetailsScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleSaveAndContinue = () => {
    // if (!companyName.trim()) {
    //   Alert.alert('Error', 'Please enter company name');
    //   return;
    // }
    // TODO: Navigate to next screen
    navigation.navigate(SCREENS.AUTH.ROLE_SELECTION);
  };

  const handleUploadUDYAM = () => {
    // TODO: Implement file upload
    Alert.alert('Upload', 'UDYAM certificate upload functionality');
  };

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

          <TouchableOpacity
            style={styles.uploadContainer}
            onPress={handleUploadUDYAM}
            activeOpacity={0.7}
          >
            <View style={styles.uploadIconContainer}>
              <Text style={styles.uploadIcon}>☁️</Text>
            </View>
            <Text
              variant="bodyMedium"
              fontWeight="medium"
              style={styles.uploadText}
            >
              Upload UDYAM Certificate
            </Text>
            <Text variant="captionSmall" style={styles.uploadSubtext}>
              PDF or JPG (Max 5MB)
            </Text>
          </TouchableOpacity>

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
