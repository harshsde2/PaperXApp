import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useAppSelector } from '@store/hooks';
import { useGetProfile } from '@services/api';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { styles } from '../styles';
import { useNavigationHelpers } from '@navigation/helpers';

export const DashboardHeader: React.FC = () => {
    const navigation = useNavigationHelpers();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData } = useGetProfile();
  const theme = useTheme();
  const primaryRole = profileData?.primary_role || user?.primaryRole || 'dealer';
  const companyName = profileData?.company_name || 'Your Company';
  const isVerified = !!profileData?.udyam_verified_at;
  const logoUrl = profileData?.avatar;

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    console.log('Notifications pressed');
  };

  const handleProfilePress = () => {
    navigation.navigate(SCREENS.MAIN.PROFILE);
  };

  const renderBrandHeader = () => (
    <View style={[styles.dashboardHeaderContainer, { paddingTop: insets.top + 12 }]}>
      <View style={styles.dashboardHeaderContent}>
        <View style={styles.dashboardHeaderLeft}>
          {/* Logo */}
          <View style={styles.brandLogoContainer}>
            {logoUrl ? (
              <View style={styles.brandLogoImage} />
            ) : (
              <View style={styles.brandLogoPlaceholder}>
                <AppIcon.Organization width={24} height={24} />
              </View>
            )}
          </View>
          
          {/* Company Info */}
          <View style={styles.brandInfoContainer}>
            <Text variant="h5" fontWeight="bold" color="#000000" numberOfLines={1}>
              {companyName}
            </Text>
            {isVerified && (
              <View style={styles.verifiedBadgeRow}>
                <View style={styles.verifiedIconContainer}>
                  <Text style={styles.verifiedCheckmark}>✓</Text>
                </View>
                <Text variant="captionMedium" color="#666666">
                  Verified Brand
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButtonContainer}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <AppIcon.Transactions width={24} height={24} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDealerHeader = () => (
    <View style={[styles.dashboardHeaderContainer, { paddingTop: insets.top + 12 }]}>
      <View style={styles.dashboardHeaderContent}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.dashboardHeaderLeft}>
          {/* Avatar */}
          <View style={styles.dealerAvatarContainer}>
            <View style={styles.dealerAvatar}>
              <AppIcon.Person width={30} height={30} />
            </View>
            <View style={styles.onlineStatusDot} />
          </View>
          
          {/* Company Info */}
          <View style={styles.dealerInfoContainer}>
            <Text variant="h6" size={14} fontWeight='extrabold' color={theme.colors.black}  numberOfLines={1}>
              {companyName}
            </Text>
            <View style={styles.roleBadgeContainer}>
              <Text variant="captionSmall" size={10} fontWeight="semibold" color={theme.colors.primary.DEFAULT}>
                {primaryRole.toUpperCase()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButtonContainer}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <AppIcon.Notification  width={24} height={24} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMachineDealerHeader = () => (
    <View style={[styles.dashboardHeaderContainer, { paddingTop: insets.top + 12 }]}>
      <View style={styles.dashboardHeaderContent}>
        <View style={styles.dashboardHeaderLeft}>
          {/* Avatar */}
          <View style={styles.machineDealerAvatarContainer}>
            <View style={styles.machineDealerAvatar}>
              <AppIcon.MachineDealer width={40} height={40} />
            </View>
          </View>
          
          {/* Title and Subtitle */}
          <View style={styles.machineDealerInfoContainer}>
            <Text variant="h5" fontWeight="bold" color="#000000">
              Machine Dealer
            </Text>
            <Text variant="bodyMedium" color="#666666">
              Dashboard
            </Text>
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButtonContainer}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <AppIcon.Transactions width={24} height={24} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConverterHeader = () => (
    <View style={[styles.dashboardHeaderContainer, { paddingTop: insets.top + 12 }]}>
      <View style={styles.dashboardHeaderContent}>
        <View style={styles.dashboardHeaderLeft}>
          {/* Avatar */}
          <View style={styles.converterAvatarContainer}>
            <View style={styles.converterAvatar}>
              <AppIcon.Converter width={40} height={40} />
            </View>
            <View style={styles.onlineStatusDot} />
          </View>
          
          {/* Welcome Message */}
          <View style={styles.converterInfoContainer}>
            <Text variant="bodyMedium" color="#666666">
              Welcome back,
            </Text>
            <Text variant="h5" fontWeight="bold" color="#000000" numberOfLines={1}>
              {companyName}
            </Text>
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButtonContainer}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <AppIcon.Transactions width={24} height={24} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render header based on role
  const role = primaryRole.toLowerCase();
  
  switch (role) {
    case 'brand':
    case 'corporate':
      return renderBrandHeader();
    case 'dealer':
      return renderDealerHeader();
    case 'machine dealer':
    case 'machinedealer':
      return renderMachineDealerHeader();
    case 'converter':
      return renderConverterHeader();
    case 'scrap dealer':
    case 'scrapdealer':
      return renderDealerHeader(); // Similar to dealer
    case 'mill':
      return renderConverterHeader(); // Similar to converter
    default:
      return renderDealerHeader(); // Default fallback
  }
};

