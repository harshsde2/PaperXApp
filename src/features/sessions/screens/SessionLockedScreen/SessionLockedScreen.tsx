/**
 * SessionLockedScreen
 * Shows locked session with shortlisted partners
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetSessionDetail } from '@services/api';
import { ShortlistedPartner } from '../../@types';
import { SessionLockedScreenRouteProp } from './@types';
import { createStyles } from './styles';

const BANNER_HEIGHT = 200;

const SessionLockedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionLockedScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { sessionId, session } = route.params || {};

  const { data: sessionDetail } = useGetSessionDetail(
    sessionId ? Number(sessionId) : 0,
    { enabled: !!sessionId }
  );

  // Get shortlisted partners for this session from API
  const partners = useMemo<ShortlistedPartner[]>(() => {
    if (!sessionDetail?.selected_partners) {
      return [];
    }

    return sessionDetail.selected_partners.map((partner) => {
      const [city = 'Unknown', country = ''] = (partner.location || '')
        .split(',')
        .map((part) => part.trim());

      return {
        id: String(partner.id),
        sessionId: sessionId || '',
        supplierId: String(partner.id),
        supplierName: partner.company_name || 'Partner',
        supplierLogo: undefined,
        isVerified: false,
        specialty: 'Selected Partner',
        location: {
          city,
          country: country || 'India',
        },
        matchType: 'exact_match',
        hasUnreadMessages: false,
        lastMessageAt: undefined,
      };
    });
  }, [sessionDetail, sessionId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewProfile = useCallback((partner: ShortlistedPartner) => {
    // TODO: Navigate to partner profile
    console.log('View profile:', partner.supplierName);
  }, []);

  const handleGoToChat = useCallback(() => {
    // Navigate to first partner's chat or chat list
    if (partners.length > 0) {
      const partner = partners[0];
      navigation.navigate(SCREENS.SESSIONS.CHAT, {
        sessionId,
        partnerId: partner.supplierId,
        partnerName: partner.supplierName,
        inquiryRef: session?.inquiryId,
      });
    }
  }, [navigation, sessionId, session, partners]);

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Locked</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Hero Banner with Gradient */}
        <View style={styles.heroBanner}>
          <Canvas style={{ position: 'absolute', width: '100%', height: BANNER_HEIGHT }}>
            <RoundedRect x={0} y={0} width={550} height={BANNER_HEIGHT} r={0}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(400, BANNER_HEIGHT)}
                colors={['rgba(30, 58, 138, 0.95)', '#3B82F6', '#60A5FA']}
              />
            </RoundedRect>
          </Canvas>

          <View style={styles.heroBannerGradient}>
            <View style={styles.lockIcon}>
              <AppIcon.Security width={20} height={20} color="#FFFFFF" />
            </View>
            <Text style={styles.heroProjectId}>
              Project ID: {session?.inquiryId || 'PRJ-2024-08'}
            </Text>
            <Text style={styles.heroTitle}>
              Session Locked - You are now connected with selected partners
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <AppIcon.Warning width={20} height={20} color={theme.colors.primary.DEFAULT} />
          <Text style={styles.infoBannerText}>
            Selection finalized. Unselected responses have been closed and moved to your project history.
          </Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shortlisted Partners</Text>
          <Text style={styles.sectionCount}>{partners.length} Selected</Text>
        </View>

        {/* Partner Cards */}
        {partners.map((partner) => (
          <View key={partner.id} style={styles.partnerCard}>
            <View style={styles.partnerInfo}>
              <View>
                <View style={styles.partnerNameRow}>
                  <Text style={styles.partnerName}>{partner.supplierName}</Text>
                  {partner.isVerified && (
                    <AppIcon.TickCheckedBox
                      width={16}
                      height={16}
                      color={theme.colors.primary.DEFAULT}
                    />
                  )}
                </View>
                <Text style={styles.partnerSpecialty}>{partner.specialty}</Text>
                <View style={styles.partnerLocation}>
                  <AppIcon.Location width={12} height={12} color={theme.colors.text.tertiary} />
                  <Text style={styles.partnerLocationText}>
                    {partner.location.city}, {partner.location.country}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => handleViewProfile(partner)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
                <AppIcon.ChevronRight width={16} height={16} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.partnerImagePlaceholder}>
              <AppIcon.Organization width={40} height={40} color={theme.colors.text.tertiary} />
            </View>
          </View>
        ))}

        {/* End of Selection */}
        <Text style={styles.endText}>End of Selection</Text>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + theme.spacing[4] }]}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleGoToChat}
          activeOpacity={0.8}
        >
          <AppIcon.Messages width={22} height={22} color="#FFFFFF" />
          <Text style={styles.chatButtonText}>Go to Chat</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default SessionLockedScreen;
