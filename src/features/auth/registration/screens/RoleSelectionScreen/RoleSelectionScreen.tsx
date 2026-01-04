import React, { useState } from 'react';
import { View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { RoleSelectionScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

type PrimaryRole = 'dealer' | 'converter' | 'brand' | 'machineDealer';
type Geography = 'local' | 'state' | 'panIndia';

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>('dealer');
  const [hasSecondaryRole, setHasSecondaryRole] = useState(false);
  const [secondaryRole, setSecondaryRole] = useState<PrimaryRole | null>(null);
  const [geography, setGeography] = useState<Geography>('local');

  const primaryRoles = [
    { id: 'dealer' as PrimaryRole, label: 'Dealer / Distributor', icon:   AppIcon.Dealer },
    { id: 'converter' as PrimaryRole, label: 'Converter / Manufacturer', icon: AppIcon.Converter },
    { id: 'brand' as PrimaryRole, label: 'Brand / End User', icon: AppIcon.Brand },
    { id: 'machineDealer' as PrimaryRole, label: 'Machine Dealer', icon: AppIcon.MachineDealer },
  ];

  const geographyOptions = [
    { id: 'local' as Geography, label: 'Local', icon: AppIcon.Location },
    { id: 'state' as Geography, label: 'State', icon: AppIcon.State },
    { id: 'panIndia' as Geography, label: 'Pan-India', icon: AppIcon.Globe },
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

  const handleContinue = () => {
    // TODO: Validate and save selection
    navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS);
  };

  const renderRoleGrid = (
    roles: typeof primaryRoles,
    selectedRole: PrimaryRole | null,
    onSelect: (roleId: PrimaryRole) => void,
  ) => (
    <View style={styles.roleGrid}>
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              isSelected && styles.roleCardSelected,
            ]}
            onPress={() => onSelect(role.id)}
            activeOpacity={0.7}
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
              variant='h6'
              fontWeight='semibold'
              style={[
                styles.roleLabel,
                isSelected && styles.roleLabelSelected,
              ]}
            >
              {role.label}
            </Text>
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

          {renderRoleGrid(primaryRoles, primaryRole, setPrimaryRole)}
        </View>

        {/* Secondary Role Section */}
        <View style={styles.section}>
          <View style={styles.secondaryRoleHeader}>
            <View style={styles.secondaryRoleHeaderLeft}>
              <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
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
              {renderRoleGrid(primaryRoles, secondaryRole, handleSecondaryRoleSelect)}
            </View>
          )}
        </View>

        {/* Operating Geography Section */}
        <View style={styles.section}>
          <Text variant="h4" fontWeight="semibold" style={styles.sectionTitle}>
            Operating Geography
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Where do you primarily operate?
          </Text>

          <View style={styles.geographyList}>
            {geographyOptions.map((option) => {
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
                      {isSelected && (
                        <View style={styles.radioButtonInner} />
                      )}
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
          style={styles.button}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default RoleSelectionScreen;
