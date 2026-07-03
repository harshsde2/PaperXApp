import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { RoleSelectionScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { ROLES } from '@utils/constants';

type PrimaryRole = 'dealer' | 'converter' | 'brand' | 'machineDealer';
type Geography = 'local' | 'state' | 'panIndia';

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>(
    ROLES.DEALER as PrimaryRole,
  );
  const [hasSecondaryRole, setHasSecondaryRole] = useState(false);
  const [secondaryRole, setSecondaryRole] = useState<PrimaryRole | null>(null);
  const [geography, setGeography] = useState<Geography>('local');

  const primaryRoles = [
    {
      id: ROLES.DEALER as PrimaryRole,
      label: 'Dealer',
      descriptor: 'Paper / Paperboard / Raw material dealer',
      icon: AppIcon.Dealer,
      isComplete: true,
    },
    {
      id: ROLES.CONVERTER as PrimaryRole,
      label: 'Manufacturer',
      descriptor: 'Manufacturer of finish goods',
      icon: AppIcon.Converter,
      isComplete: true,
    },
    {
      id: ROLES.BRAND as PrimaryRole,
      label: 'Brand',
      descriptor: 'Individual or company requiring packaging',
      icon: AppIcon.Brand,
      isComplete: true,
    },
    {
      id: ROLES.MACHINE_DEALER as PrimaryRole,
      label: 'Machine Dealer',
      descriptor: 'Paper / Printing / Packaging machine dealer',
      icon: AppIcon.MachineDealer,
      isComplete: true,
    },
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
    navigation.navigate(SCREENS.AUTH.COMPANY_DETAILS, {
      primaryRole,
      secondaryRole: secondaryRole || undefined,
      hasSecondaryRole: hasSecondaryRole ? 1 : 0,
      geography,
    });
  };

  const renderRoleGrid = (
    roles: typeof primaryRoles,
    selectedRole: PrimaryRole | null,
    onSelect: (roleId: PrimaryRole) => void,
  ) => (
    <View style={styles.roleList}>
      {roles.map(role => {
        const isSelected = selectedRole === role.id;
        return (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleRow, isSelected && styles.roleRowSelected, !role.isComplete && styles.roleCardIncomplete]}
            onPress={() => onSelect(role.id)}
            activeOpacity={0.7}
            disabled={!role.isComplete}
          >
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
            <View style={styles.roleTextColumn}>
              <Text
                variant="h6"
                fontWeight="semibold"
                style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}
              >
                {role.label}
              </Text>
              <Text variant="bodySmall" style={styles.roleDescriptor}>
                {role.descriptor}
              </Text>
              {!role.isComplete && (
                <Text variant="bodySmall" size={8} style={styles.roleCompleteText}>
                  This role is not Available for now
                </Text>
              )}
            </View>
            {isSelected && (
              <View style={styles.checkmarkContainer}>
                <AppIcon.TickCheckedBox
                  width={20}
                  height={20}
                  fill={theme.colors.primary.DEFAULT}
                />
              </View>
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
        <CustomButton
          title="Continue"
          onPress={handleContinue}
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
          rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
          style={styles.button}
        />
      </View>
    </ScreenWrapper>
  );
};

export default RoleSelectionScreen;
