import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, LayoutChangeEvent } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ANDROID_BLUR, GLASS_TINT_OPACITY } from '@shared/constants/glass';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { getColorWithOpacity } from '@theme/utils/themeHelpers';
import { useAppSelector } from '@store/hooks';
import { useGetProfile, useNotificationUnreadCount, useGetActiveSessions } from '@services/api';
import type { ActiveSessionListItem } from '@services/api';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { styles } from '../styles';
import { useNavigationHelpers } from '@navigation/helpers';

const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
};

export type DashboardHeaderProps = {
  /** Reports total header height so scroll content can use matching paddingTop while scrolling under the blur */
  onLayoutHeight?: (height: number) => void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLayoutHeight }) => {
  const navigation = useNavigationHelpers();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData } = useGetProfile();
  const { data: unreadData } = useNotificationUnreadCount();
  // Shared React Query cache with ResponsesCard / ResponsesListScreen — no extra network.
  const { data: activeSessionsData } = useGetActiveSessions({ filter: 'all', per_page: 50 });
  const responsesCount = useMemo(() => {
    const sessions = (activeSessionsData?.data ?? []) as ActiveSessionListItem[];
    return sessions
      .filter((s) => s.is_owner === true && (s.responses_received ?? 0) > 0)
      .reduce((sum, s) => sum + (s.responses_received ?? 0), 0);
  }, [activeSessionsData]);
  const theme = useTheme();
  const primaryRole = profileData?.primary_role || user?.primaryRole || 'dealer';
  const companyName = profileData?.company_name || 'Your Company';
  const isVerified = !!profileData?.udyam_verified_at;
  const avatarUrl = profileData?.avatar;
  const initials = getInitials(companyName);
  const unreadCount = unreadData?.unread_count ?? 0;

  const blurFallbackColors = useMemo(
    () => ({
      iosReducedTransparency: getColorWithOpacity(theme.colors.white, 52),
    }),
    [theme.colors.white],
  );

  const renderGlassBackground = () => (
    <>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={6}
        blurRadius={ANDROID_BLUR.blurRadius}
        downsampleFactor={ANDROID_BLUR.downsampleFactor}
        overlayColor={ANDROID_BLUR.overlayColor}
        reducedTransparencyFallbackColor={blurFallbackColors.iosReducedTransparency}
        pointerEvents="none"
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: getColorWithOpacity(theme.colors.white, GLASS_TINT_OPACITY) },
        ]}
      />
    </>
  );

  const handleHeaderLayout = (e: LayoutChangeEvent) => {
    onLayoutHeight?.(e.nativeEvent.layout.height);
  };

  const wrapFloatingHeader = (contentRow: React.ReactNode) => (
    <View
      style={[styles.glassHeaderRoot, styles.glassHeaderFloating]}
      onLayout={handleHeaderLayout}
      collapsable={false}
    >
      {renderGlassBackground()}
      {contentRow}
    </View>
  );

  const handleNotificationPress = () => {
    navigation.navigate(SCREENS.MAIN.NOTIFICATIONS);
  };

  const handleMessagesPress = () => {
    navigation.navigate(SCREENS.MAIN.RESPONSES);
  };

  const handleProfilePress = () => {
    navigation.navigate(SCREENS.MAIN.PROFILE);
  };

  const renderHeaderActions = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity onPress={handleMessagesPress} style={styles.notificationButtonContainer}>
        <AppIcon.Messages width={20} height={20} color={theme.colors.text.primary} />
        {responsesCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text variant="captionSmall" style={styles.notificationBadgeText}>
              {responsesCount > 99 ? '99+' : responsesCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButtonContainer}>
        <AppIcon.Notification width={20} height={20} color={theme.colors.text.primary} />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text variant="captionSmall" style={styles.notificationBadgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderAvatarWithInitials = (
    size: number = 40,
    showOnlineDot: boolean = false
  ) => (
    <View style={{ position: 'relative', marginRight: 12 }}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.primary[50] }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.primary[100],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            variant="h5"
            fontWeight="bold"
            style={{ color: theme.colors.primary.DEFAULT, fontSize: size * 0.4 }}
          >
            {initials}
          </Text>
        </View>
      )}
      {showOnlineDot && <View style={styles.onlineStatusDot} />}
    </View>
  );

  const renderBrandHeader = () =>
    wrapFloatingHeader(
      <View style={[styles.dashboardHeaderContent, styles.glassHeaderContent, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.dashboardHeaderLeft}>
          {renderAvatarWithInitials(40)}
          
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
        </TouchableOpacity>

        {renderHeaderActions()}
      </View>
    );

  const renderDealerHeader = () =>
    wrapFloatingHeader(
      <View style={[styles.dashboardHeaderContent, styles.glassHeaderContent, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.dashboardHeaderLeft}>
          {renderAvatarWithInitials(40, true)}
          
          {/* Company Info */}
          <View style={styles.dealerInfoContainer}>
            <Text variant="h6" size={14} fontWeight='extrabold' color={theme.colors.black}  numberOfLines={1}>
              {companyName}
            </Text>
          </View>
        </TouchableOpacity>

        {renderHeaderActions()}
      </View>
    );

  const renderMachineDealerHeader = () =>
    wrapFloatingHeader(
      <View style={[styles.dashboardHeaderContent, styles.glassHeaderContent, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.dashboardHeaderLeft}>
          {renderAvatarWithInitials(40)}
          
          {/* Title and Subtitle */}
          <View style={styles.machineDealerInfoContainer}>
            <Text variant="h5" fontWeight="bold" color="#000000">
              Machine Dealer
            </Text>
            <Text variant="bodyMedium" color="#666666">
              Dashboard
            </Text>
          </View>
        </TouchableOpacity>

        {renderHeaderActions()}
      </View>
    );

  const renderConverterHeader = () =>
    wrapFloatingHeader(
      <View style={[styles.dashboardHeaderContent, styles.glassHeaderContent, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.dashboardHeaderLeft}>
          {renderAvatarWithInitials(40, true)}
          
          {/* Welcome Message */}
          <View style={styles.converterInfoContainer}>
            <Text variant="bodyMedium" color="#666666">
              Welcome back,
            </Text>
            <Text variant="h5" fontWeight="bold" color="#000000" numberOfLines={1}>
              {companyName}
            </Text>
          </View>
        </TouchableOpacity>

        {renderHeaderActions()}
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

