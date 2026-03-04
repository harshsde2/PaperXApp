import React, { useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useGetActiveSessions, useGetWalletBalance } from '@services/api';
import type { ActiveSessionListItem } from '@services/api/sessionApi/@types';
import type {
  MachineDealerDashboardViewProps,
  MachineSnapshotData,
  TransformedSession,
} from './@types';
import { createStyles } from './styles';

const defaultSnapshotData: MachineSnapshotData = {
  activeListings: 0,
  activeRequirements: 0,
  responsesReceived: 0,
};

export const MachineDealerDashboardView: React.FC<MachineDealerDashboardViewProps> = ({
  dashboardData,
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { data: wallet } = useGetWalletBalance();
  const {
    data: activeSessionsResponse,
    refetch: refetchActiveSessions,
    isRefetching: isSessionsRefetching,
  } = useGetActiveSessions({ filter: 'all', per_page: 5 });

  const activeSessions = activeSessionsResponse?.data ?? [];
  const isRefreshing = refreshing || isSessionsRefetching;

  const machineSnapshot: MachineSnapshotData = useMemo(() => {
    const data = dashboardData as any;
    return {
      ...defaultSnapshotData,
      activeListings:
        data?.active_listings_count ?? data?.inventoryCount ?? defaultSnapshotData.activeListings,
      activeRequirements:
        data?.active_requirements_count ??
        data?.opportunities ??
        defaultSnapshotData.activeRequirements,
      responsesReceived:
        data?.responses_received_count ?? data?.responses ?? defaultSnapshotData.responsesReceived,
    };
  }, [dashboardData]);

  const transformedSessions = useMemo((): TransformedSession[] => {
    if (!activeSessions.length) return [];
    return activeSessions.slice(0, 5).map((session: ActiveSessionListItem) => {
      const firstItem = session.items?.[0];
      const totalQuantity = session.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      let status: TransformedSession['status'] = 'ACTIVE';
      if (session.status === 'RESPONSES_RECEIVED' || session.status === 'CHAT_ACTIVE') {
        status = 'NEGOTIATION';
      } else if (session.status === 'MATCHING') {
        status = 'WAITING';
      }

      let timeRemaining = '';
      if (session.countdown) {
        const { days, hours, minutes } = session.countdown;
        if (days > 0) timeRemaining = `${days}d ${hours}h`;
        else if (hours > 0) timeRemaining = `${hours}h ${minutes}m`;
        else timeRemaining = `${minutes}m`;
      }

      const companyName = session.title.split('-')[0]?.trim() || session.poster_label || 'Company';
      const companyAvatar = companyName.charAt(0).toUpperCase();
      const materialName = firstItem?.material_category || 'Machine';
      const quantityUnit = firstItem?.quantity_unit || 'units';
      const description = `${materialName} - ${totalQuantity} ${quantityUnit}`;
      const safeResponsesReceived = Number(session.responses_received ?? 0);
      const safeMatchedDealers = Number(session.matched_dealers_count ?? 0);
      const safeMatchingProgressMatched = Number(session.matching_progress?.matched ?? 0);
      const hasExplicitResponses = session.responses_received !== null && session.responses_received !== undefined;
      const resolvedResponsesReceived = hasExplicitResponses
        ? Number.isFinite(safeResponsesReceived)
          ? safeResponsesReceived
          : 0
        : Math.max(
          Number.isFinite(safeMatchingProgressMatched) ? safeMatchingProgressMatched : 0,
          Number.isFinite(safeMatchedDealers) ? safeMatchedDealers : 0
        );
      const totalExpectedResponses = 10;
      const responsesReceived = Math.max(
        0,
        Math.min(resolvedResponsesReceived, totalExpectedResponses)
      );
      const progressPercent = (responsesReceived / totalExpectedResponses) * 100;

      return {
        id: String(session.id),
        status,
        timeRemaining,
        companyAvatar,
        company: companyName,
        description,
        actionRequired: session.status === 'RESPONSES_RECEIVED',
        responsesReceived,
        totalExpectedResponses,
        progressPercent,
      };
    });
  }, [activeSessions]);

  const creditsFormatted =
    wallet?.balance != null
      ? Number(wallet.balance).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      : '0.00';

  const handleRefresh = () => {
    onRefresh?.();
    refetchActiveSessions();
  };

  const handleAddCredits = () => {
    navigation.navigate(SCREENS.WALLET.CREDIT_PACKS);
  };

  const handlePostToBuyMachine = () => {
    navigation.navigate(SCREENS.MAIN.POST_TO_BUY_MACHINE);
  };

  const handlePostToSellMachine = () => {
    navigation.navigate(SCREENS.MAIN.POST_TO_SELL_MACHINE);
  };

  const handleViewAllSessions = () => {
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, { initialTab: 'all' });
  };

  const handleSessionPress = (sessionId: string) => {
    // navigation.navigate(SCREENS.SESSIONS.DETAILS, { sessionId });
  };

  const handleSnapshotRequirements = () => {
    navigation.navigate(SCREENS.MAIN.MARKET);
  };

  const handleSnapshotSessions = () => {
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, { initialTab: 'all' });
  };

  const [cardLayout, setCardLayout] = useState({ width: 200, height: 120 });
  const onCardLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setCardLayout({ width, height });
  }, []);

  const primaryGradient = useMemo(
    () =>
      [
        theme.colors.primary.dark ?? theme.colors.primary[700],
        theme.colors.primary.DEFAULT,
        theme.colors.primary.light ?? theme.colors.primary[400],
      ].filter(Boolean) as string[],
    [theme.colors.primary]
  );
  const secondaryBlueGradient = useMemo(
    () =>
      [
        theme.colors.primary[700],
        theme.colors.primary[500],
        theme.colors.primary[300],
      ].filter(Boolean) as string[],
    [theme.colors.primary]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary.DEFAULT}
          colors={[theme.colors.primary.DEFAULT]}
        />
      }
    >
      {/* <View style={styles.creditsBar}>
        <View style={styles.creditsLeft}>
          <View style={styles.creditsIconWrap}>
            <AppIcon.Wallet width={24} height={24} color={theme.colors.primary.DEFAULT} />
          </View>
          <View>
            <Text style={styles.creditsLabel}>PAPERX CREDITS</Text>
            <Text style={styles.creditsValue}>{creditsFormatted}</Text>
          </View>
        </View>
        <CustomButton
          title="Add Credits"
          onPress={handleAddCredits}
          variant="gradient"
          size="sm"
          textStyle={styles.addCreditsButtonText}
        />
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionCardWrapper]}
            onPress={handlePostToBuyMachine}
            onLayout={onCardLayout}
            activeOpacity={0.85}
          >
            <Canvas
              style={[
                styles.quickActionGradientCanvas,
                { width: cardLayout.width, height: cardLayout.height },
              ]}
            >
              <RoundedRect
                x={0}
                y={0}
                width={cardLayout.width}
                height={cardLayout.height}
                r={theme.borderRadius.card.lg ?? 12}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(cardLayout.width, cardLayout.height)}
                  colors={
                    primaryGradient.length >= 2
                      ? primaryGradient
                      : [
                        theme.colors.primary.DEFAULT,
                        theme.colors.primary.light ?? theme.colors.primary.DEFAULT,
                      ]
                  }
                />
              </RoundedRect>
            </Canvas>
            <View style={styles.quickActionContent}>
              {/* <View style={styles.quickActionIconBg}>
                <AppIcon.Inquiries width={48} height={48} color={theme.colors.text.inverse} />
              </View> */}
              <View style={styles.quickActionIcon}>
                <AppIcon.Inquiries width={36} height={36} color={theme.colors.text.inverse} />
              </View>
              <Text fontWeight="bold" style={styles.quickActionLabel}>
                Post to Buy
              </Text>
              <Text style={styles.quickActionSubtext}>Find machines from verified sellers</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionCardWrapper]}
            onPress={handlePostToSellMachine}
            activeOpacity={0.85}
          >
            <Canvas
              style={[
                styles.quickActionGradientCanvas,
                { width: cardLayout.width, height: cardLayout.height },
              ]}
            >
              <RoundedRect
                x={0}
                y={0}
                width={cardLayout.width}
                height={cardLayout.height}
                r={theme.borderRadius.card.lg ?? 12}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(cardLayout.width, cardLayout.height)}
                  colors={
                    secondaryBlueGradient.length >= 2
                      ? secondaryBlueGradient
                      : [
                        theme.colors.primary.DEFAULT,
                        theme.colors.primary.light ?? theme.colors.primary.DEFAULT,
                      ]
                  }
                />
              </RoundedRect>
            </Canvas>
            <View style={styles.quickActionContent}>
              {/* <View style={styles.quickActionIconBg}>
                <AppIcon.Market width={48} height={48} color={theme.colors.text.inverse} />
              </View> */}
              <View style={styles.quickActionIcon}>
                <AppIcon.Market width={36} height={36} color={theme.colors.text.inverse} />
              </View>
              <Text fontWeight="bold" style={styles.quickActionLabel}>
                Post to Sell
              </Text>
              <Text style={styles.quickActionSubtext}>List your machine for matched buyers</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Machine Snapshot</Text>
        <View style={styles.snapshotCardsRow}>
          <TouchableOpacity style={styles.snapshotCard} onPress={handlePostToSellMachine} activeOpacity={0.7}>
            <Text style={styles.snapshotCardLabel}>Active Listings</Text>
            <Text style={styles.snapshotCardValue}>{machineSnapshot.activeListings}</Text>
            <View style={styles.snapshotCardSub}>
              <AppIcon.TickCheckedBox width={14} height={14} color={theme.colors.success.DEFAULT} />
              <Text style={styles.snapshotCardSubText}>
                {machineSnapshot.activeListings > 0 ? 'Live listings' : 'No listings'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.snapshotCard}
            onPress={handleSnapshotRequirements}
            activeOpacity={0.7}
          >
            <Text style={styles.snapshotCardLabel}>Buy Requests</Text>
            <Text style={styles.snapshotCardValue}>{machineSnapshot.activeRequirements}</Text>
            <View style={styles.snapshotCardSub}>
              <AppIcon.Warning width={14} height={14} color={theme.colors.warning.DEFAULT} />
              <Text style={styles.snapshotCardSubText}>Available opportunities</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.snapshotCard} onPress={handleSnapshotSessions} activeOpacity={0.7}>
            <Text style={styles.snapshotCardLabel}>Responses</Text>
            <Text style={styles.snapshotCardValue}>{machineSnapshot.responsesReceived}</Text>
            <View style={styles.snapshotCardSub}>
              <AppIcon.ArrowRight width={14} height={14} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.snapshotCardSubText}>Session activity</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={styles.activeSessionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          <TouchableOpacity onPress={handleViewAllSessions}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {transformedSessions.length === 0 ? (
          <View style={styles.emptySessionsCard}>
            <View style={styles.emptySessionsIconWrap}>
              <AppIcon.Sessions width={32} height={32} color={theme.colors.primary.DEFAULT} />
            </View>
            <Text style={styles.emptySessionsTitle}>No active sessions</Text>
            <Text style={styles.emptySessionsDesc}>
              You do not have any ongoing machine sessions right now.
            </Text>
            <View style={{ alignSelf: 'center' }}>
              <CustomButton
                title="View All Sessions"
                onPress={handleViewAllSessions}
                variant="gradient"
                size="sm"
                style={{ marginTop: theme.spacing[2], alignSelf: 'flex-start' }}
                textStyle={styles.viewAllSessionsButtonText}
              />
            </View>
          </View>
        ) : (
          <>
            {transformedSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionCard}
                onPress={() => handleSessionPress(session.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionStatusBadge}>
                    <View
                      style={[
                        styles.sessionStatusDot,
                        {
                          backgroundColor:
                            session.status === 'NEGOTIATION'
                              ? theme.colors.success.DEFAULT
                              : theme.colors.warning.DEFAULT,
                        },
                      ]}
                    />
                    <Text style={styles.sessionStatusText}>{session.status.replace('_', ' ')}</Text>
                  </View>
                  {session.timeRemaining ? (
                    <View style={styles.sessionTimeContainer}>
                      <AppIcon.Sessions
                        width={14}
                        height={14}
                        color={theme.colors.primary.DEFAULT}
                      />
                      <Text style={styles.sessionTimeText}>{session.timeRemaining}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.sessionContent}>
                  <View style={styles.sessionAvatar}>
                    <Text style={styles.sessionAvatarText}>{session.companyAvatar}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionCompany}>{session.company}</Text>
                    <Text style={styles.sessionDescription}>{session.description}</Text>
                  </View>
                  {session.actionRequired ? (
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Action</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.chatButton}>
                      <AppIcon.Messages width={20} height={20} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.sessionProgress}>
                  <View style={styles.progressMetaRow}>
                    <Text style={styles.progressMetaLabel}>Responses Received</Text>
                    <Text style={styles.progressMetaValue}>
                      {session.responsesReceived}/{session.totalExpectedResponses}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${session.progressPercent}%` },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ alignSelf: 'center' }}>
              <CustomButton
                title="View All Sessions"
                onPress={handleViewAllSessions}
                variant="gradient"
                size="sm"
                style={{ marginTop: theme.spacing[2], alignSelf: 'flex-start' }}
                textStyle={styles.viewAllSessionsButtonText}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};
