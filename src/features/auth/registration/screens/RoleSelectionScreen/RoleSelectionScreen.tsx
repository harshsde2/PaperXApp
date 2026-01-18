import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import {
  RoleSelectionScreenNavigationProp,
  RoleSelectionScreenRouteProp,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { useUpdateProfile } from '@services/api';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';

type PrimaryRole = 'dealer' | 'converter' | 'brand' | 'machineDealer';
type Geography = 'local' | 'state' | 'panIndia';

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const route = useRoute<RoleSelectionScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const updateProfileMutation = useUpdateProfile();

  // Get data from previous screen
  const {
    companyName,
    gstIn,
    state,
    city,
    udyamCertificateBase64,
    udyamCertificateName,
    udyamCertificateType,
  } = route.params || {};

  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>(
    ROLES.DEALER as PrimaryRole,
  );
  const [hasSecondaryRole, setHasSecondaryRole] = useState(false);
  const [secondaryRole, setSecondaryRole] = useState<PrimaryRole | null>(null);
  const [geography, setGeography] = useState<Geography>('local');

  const primaryRoles = [
    {
      id: ROLES.DEALER as PrimaryRole,
      label: 'Dealer / Distributor',
      icon: AppIcon.Dealer,
      isComplete: true,
    },
    {
      id: ROLES.CONVERTER as PrimaryRole,
      label: 'Converter / Manufacturer',
      icon: AppIcon.Converter,
      isComplete: false,
    },
    {
      id: ROLES.BRAND as PrimaryRole,
      label: 'Brand / End User',
      icon: AppIcon.Brand,
      isComplete: true,
    },
    {
      id: ROLES.MACHINE_DEALER as PrimaryRole,
      label: 'Machine Dealer',
      icon: AppIcon.MachineDealer,
      isComplete: false,
    },
  ];

  const geographyOptions = [
    { id: 'local' as Geography, label: 'Local', icon: AppIcon.Location },
    { id: 'state' as Geography, label: 'State', icon: AppIcon.State },
    { id: 'pan india' as Geography, label: 'Pan-India', icon: AppIcon.Globe },
  ];

  const handleSecondaryRoleToggle = (value: boolean) => {
    setHasSecondaryRole(value);
    if (!value) {
      setSecondaryRole(null);
    }
  };

  const handleSecondaryRoleSelect = (roleId: PrimaryRole) => {
    if (roleId !== primaryRole) {
      setSecondaryRole(roleId);
    }
  };

  const handleContinue = async () => {
    try {
      // Prepare update profile data
      const updateData: any = {
        company_name: companyName,
        gst_in: gstIn,
        state: state,
        city: city,
        primary_role: primaryRole,
        secondary_role: secondaryRole || undefined,
        has_secondary_role: hasSecondaryRole ? 1 : 0,
        operation_area: geography,
      };

      // Add UDYAM certificate if provided (as base64)
      if (udyamCertificateBase64) {
        // updateData.udyam_certificate = udyamCertificateBase64;
        updateData.udyam_certificate_name = udyamCertificateName;
        updateData.udyam_certificate_type = udyamCertificateType;
      }

      // Call API to update profile
      const response = await updateProfileMutation.mutateAsync(updateData);

      // Get the first registration screen for the selected role
      // primaryRole is already a valid UserRole value (matches ROLES constants)
      const firstScreen = getFirstRegistrationScreen(
        primaryRole as (typeof ROLES)[keyof typeof ROLES],
      );

      if (firstScreen && firstScreen !== SCREENS.AUTH.VERIFICATION_STATUS) {
        // Navigate to role-specific registration flow
        // Pass profile data so it can be used at the end of registration
        // Type assertion needed because firstScreen is a dynamic string
        (navigation.navigate as any)(firstScreen, {
          profileData: response,
        } as any);
      } else {
        // Role has no specific registration screens, go directly to verification
        navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
          profileData: response,
        } as any);
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert(
        'Registration Failed',
        error?.message || 'Failed to update profile. Please try again.',
        [{ text: 'OK' }],
      );
    }
  };

  const renderRoleGrid = (
    roles: typeof primaryRoles,
    selectedRole: PrimaryRole | null,
    onSelect: (roleId: PrimaryRole) => void,
  ) => (
    <View style={styles.roleGrid}>
      {roles.map(role => {
        const isSelected = selectedRole === role.id;
        return (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, isSelected && styles.roleCardSelected, !role.isComplete && styles.roleCardIncomplete]}
            onPress={() => onSelect(role.id)}
            activeOpacity={0.7}
            disabled={!role.isComplete}
          >
            {isSelected && (
              <View style={styles.checkmarkContainer}>
                <AppIcon.TickCheckedBox
                  width={20}
                  height={20}
                  fill={theme.colors.primary.DEFAULT}
                />
              </View>
            )}
            {role.icon && (
              <role.icon
                width={40}
                height={40}
                color={
                  isSelected
                    ? theme.colors.primary.DEFAULT
                    : theme.colors.text.tertiary
                }
              />
            )}
            <Text
              variant="h6"
              fontWeight="semibold"
              style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}
            >
              {role.label}
            </Text>
            {!role.isComplete && (
              <Text variant="bodySmall" size={8} style={styles.roleCompleteText}>
                This role is not Available for now 
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Welcome Message */}
        <Text variant="h3" fontWeight="bold" style={styles.welcomeText}>
          Welcome. Let's set up your profile.
        </Text>

        {/* Primary Role Section */}
        <View style={styles.section}>
          <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
            Primary Role
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Select the main function of your business.
          </Text>
          <View pointerEvents={!hasSecondaryRole ? 'auto' : 'none'} style={[{opacity: !hasSecondaryRole ? 1 : 0.5}]}>

          {renderRoleGrid(primaryRoles, primaryRole, setPrimaryRole)}
          </View>
        </View>

        {/* Secondary Role Section */}
        {/* <View style={styles.section}>
          <View style={styles.secondaryRoleHeader}>
            <View style={styles.secondaryRoleHeaderLeft}>
              <Text
                variant="h4"
                fontWeight="semibold"
                style={styles.sectionTitle}
              >
                Secondary Role
              </Text>
              <Text variant="bodySmall" style={styles.sectionSubtitle}>
                Optional • Select if you have multiple functions.
              </Text>
            </View>
            <Switch
              value={hasSecondaryRole}
              onValueChange={handleSecondaryRoleToggle}
              trackColor={{
                false: theme.colors.border.primary,
                true: theme.colors.primary.DEFAULT,
              }}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              thumbColor={theme.colors.surface.primary}
              ios_backgroundColor={theme.colors.border.primary}
            />
          </View>
          {hasSecondaryRole && (
            <View style={styles.secondaryRoleGridContainer}>
              {renderRoleGrid(
                primaryRoles,
                secondaryRole,
                handleSecondaryRoleSelect,
              )}
            </View>
          )}
        </View> */}

        {/* Operating Geography Section */}
        <View style={styles.section}>
          <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
            Operating Geography
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Where do you primarily operate?
          </Text>

          <View style={styles.geographyList}>
            {geographyOptions.map(option => {
              const isSelected = geography === option.id;
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.geographyCard,
                    isSelected && styles.geographyCardSelected,
                  ]}
                  onPress={() => setGeography(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.geographyLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text
                      variant="bodyMedium"
                      fontWeight="medium"
                      style={styles.geographyLabel}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {Icon && (
                    <Icon
                      width={20}
                      height={20}
                      fill={
                        isSelected
                          ? theme.colors.primary.DEFAULT
                          : theme.colors.text.tertiary
                      }
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.button,
            updateProfileMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color={theme.colors.text.inverse} />
          ) : (
            <Text variant="buttonMedium" style={styles.buttonText}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default RoleSelectionScreen;
