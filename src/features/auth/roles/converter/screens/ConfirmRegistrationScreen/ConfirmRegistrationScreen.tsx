import React, { useState } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { ConfirmRegistrationScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

const ConfirmRegistrationScreen = () => {
  const navigation = useNavigation<ConfirmRegistrationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ConfirmRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Get profileData from route params
  const { profileData } = route.params || {};
  
  const [termsAccepted, setTermsAccepted] = useState(false);

  const currentStep = 4;
  const totalSteps = 4;

  const handleEdit = (section: string) => {
    // TODO: Navigate back to the relevant screen for editing
    // Example: navigation.navigate(SCREENS.AUTH.CONVERTER_TYPE);
  };

  const handleTermsPress = () => {
    // TODO: Open Terms of Service link
    // Linking.openURL('https://example.com/terms');
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      // TODO: Show error message
      return;
    }
    // Submit registration and navigate to verification screen
    // This is the last screen in converter registration flow
    navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, { profileData });
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
          Summary View
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Please review your details carefully before submitting.
        </Text>

        {/* Account Info Section */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <AppIcon.PersonIcon
                  width={24}
                  height={24}
                  color={theme.colors.primary.DEFAULT}
                />
              </View>
              <Text variant="h6" fontWeight="semibold" style={styles.cardTitle}>
                Account Info
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('account')}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" style={styles.editButtonText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Full Name
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                Alex Sterling
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Email
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                alex@packtech.com
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Job Title
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                Procurement Manager
              </Text>
            </View>
          </View>
        </Card>

        {/* Company Profile Section */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <AppIcon.Organization
                  width={24}
                  height={24}
                  color={theme.colors.primary.DEFAULT}
                />
              </View>
              <Text variant="h6" fontWeight="semibold" style={styles.cardTitle}>
                Company Profile
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('company')}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" style={styles.editButtonText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Company
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                PackTech Solutions Ltd.
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Website
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text variant="bodySmall" style={styles.linkValue}>
                  packtech-solutions.com
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                HQ Location
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                Chicago, IL, USA
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Employees
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                51-200
              </Text>
            </View>
          </View>
        </Card>

        {/* Industry Details Section */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <Text style={styles.gearIcon}>⚙️</Text>
              </View>
              <Text variant="h6" fontWeight="semibold" style={styles.cardTitle}>
                Industry Details
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('industry')}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" style={styles.editButtonText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Primary Sector
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                Corrugated Packaging
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Output Cap.
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                2.5M units/mo
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Machine Types
              </Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text variant="bodySmall" fontWeight="medium" style={styles.tagText}>
                    Flexo Folder Gluer
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text variant="bodySmall" fontWeight="medium" style={styles.tagText}>
                    Rotary Die Cutter
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Sourcing Needs Section */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <Text style={styles.packageIcon}>📦</Text>
              </View>
              <Text variant="h6" fontWeight="semibold" style={styles.cardTitle}>
                Sourcing Needs
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('sourcing')}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" style={styles.editButtonText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Looking For
              </Text>
              <Text variant="bodySmall" fontWeight="medium" style={styles.detailValue}>
                Raw Material Suppliers (Kraft Liner)
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Certifications
              </Text>
              <View style={styles.tagsContainer}>
                <View style={[styles.tag, styles.tagSuccess]}>
                  <Text variant="bodySmall" fontWeight="medium" style={styles.tagTextSuccess}>
                    FSC Certified
                  </Text>
                </View>
                <View style={[styles.tag, styles.tagSuccess]}>
                  <Text variant="bodySmall" fontWeight="medium" style={styles.tagTextSuccess}>
                    ISO 9001
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Terms Checkbox */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
            activeOpacity={0.7}
          >
            {termsAccepted ? (
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
          <Text variant="bodyMedium" style={styles.termsText}>
            I verify that this information is accurate and agree to the{' '}
            <Text
              variant="bodyMedium"
              style={styles.termsLink}
              onPress={handleTermsPress}
            >
              Terms of Service
            </Text>
            .
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !termsAccepted && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!termsAccepted}
        >
          <Text variant="buttonMedium" style={styles.submitButtonText}>
            Submit Registration
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ConfirmRegistrationScreen;

