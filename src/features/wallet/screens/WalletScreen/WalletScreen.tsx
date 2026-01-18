/**
 * WalletScreen - Premium Design
 * Main wallet dashboard with beautiful gradient card and modern UI
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { TransactionItem } from '@shared/components/TransactionItem';
import { AppIcon } from '@assets/svgs';
import { useGetWalletBalance, useGetTransactions } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';

const CARD_HEIGHT = 200;

const WalletScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useGetWalletBalance();

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useGetTransactions({ per_page: 5 });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchTransactions()]);
    setRefreshing(false);
  }, [refetchWallet, refetchTransactions]);

  const handleBuyCredits = useCallback(() => {
    navigation.navigate(SCREENS.WALLET.CREDIT_PACKS);
  }, [navigation]);

  const handleViewTransactions = useCallback(() => {
    navigation.navigate(SCREENS.WALLET.TRANSACTION_HISTORY);
  }, [navigation]);

  const formatBalance = (balance: number): string => {
    if (balance >= 10000) {
      return (balance / 1000).toFixed(1) + 'K';
    }
    return balance.toLocaleString('en-IN');
  };

  const transactions = transactionsData?.transactions || [];

  // Calculate stats
  const stats = useMemo(() => {
    let totalAdded = 0;
    let totalDeducted = 0;
    transactions.forEach((t) => {
      if (t.type === 'ADDED') {
        totalAdded += t.amount;
      } else {
        totalDeducted += t.amount;
      }
    });
    return { totalAdded, totalDeducted };
  }, [transactions]);

  if (walletLoading) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <AppIcon.Wallet width={48} height={48} color={theme.colors.primary.DEFAULT} />
            <ActivityIndicator
              size="large"
              color={theme.colors.primary.DEFAULT}
              style={{ marginTop: 16 }}
            />
            <Text style={styles.loadingText}>Loading your wallet...</Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (walletError) {
    return (
      <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconWrapper}>
              <AppIcon.Warning width={32} height={32} color="#DC2626" />
            </View>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorText}>
              We couldn't load your wallet. Please check your connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetchWallet()}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper safeAreaEdges={['top']} backgroundColor={theme.colors.background.secondary}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      >
        {/* Premium Balance Card */}
        <View style={styles.balanceCardWrapper}>
          <View style={styles.balanceCard}>
            {/* Gradient Background using Skia */}
            <Canvas style={{ position: 'absolute', width: '100%', height: CARD_HEIGHT }}>
              <RoundedRect x={0} y={0} width={400} height={CARD_HEIGHT} r={20}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(400, CARD_HEIGHT)}
                  colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
                />
              </RoundedRect>
            </Canvas>

            <View style={styles.balanceCardGradient}>
              {/* Header */}
              <View style={styles.balanceCardHeader}>
                <View style={styles.balanceCardTitleSection}>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>
                      {formatBalance(wallet?.balance ?? 0)}
                    </Text>
                    <Text style={styles.balanceUnit}>Credits</Text>
                  </View>
                </View>
                <View style={styles.balanceCardIcon}>
                  <AppIcon.Wallet width={24} height={24} color="#FFFFFF" />
                </View>
              </View>

              {/* Status Footer */}
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{wallet?.status || 'ACTIVE'}</Text>
                <Text style={styles.walletIdText}>{wallet?.wallet_id || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleBuyCredits}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIconWrapper, styles.quickActionIconBuy]}>
              <AppIcon.Wallet width={28} height={28} color="#16A34A" />
            </View>
            <Text style={styles.quickActionTitle}>Buy Credits</Text>
            <Text style={styles.quickActionSubtitle}>Add more credits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleViewTransactions}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIconWrapper, styles.quickActionIconHistory]}>
              <AppIcon.Transactions width={28} height={28} color="#2563EB" />
            </View>
            <Text style={styles.quickActionTitle}>History</Text>
            <Text style={styles.quickActionSubtitle}>View all transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        {transactions.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconRow}>
                <View style={[styles.statIconWrapper, styles.statIconCredit]}>
                  <AppIcon.ArrowRight width={16} height={16} color="#16A34A" />
                </View>
                <Text style={styles.statLabel}>Total Added</Text>
              </View>
              <Text style={[styles.statValue, styles.statValueCredit]}>
                +{stats.totalAdded.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconRow}>
                <View style={[styles.statIconWrapper, styles.statIconDebit]}>
                  <AppIcon.ArrowLeft width={16} height={16} color="#DC2626" />
                </View>
                <Text style={styles.statLabel}>Total Used</Text>
              </View>
              <Text style={[styles.statValue, styles.statValueDebit]}>
                -{stats.totalDeducted.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIcon}>
                <AppIcon.Transactions width={16} height={16} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            {transactions.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewTransactions}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <AppIcon.ChevronRight width={16} height={16} color={theme.colors.primary.DEFAULT} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.transactionsCard}>
            {transactionsLoading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator color={theme.colors.primary.DEFAULT} size="large" />
              </View>
            ) : transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <TransactionItem transaction={transaction} />
                  {index < transactions.length - 1 && <View style={styles.transactionDivider} />}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrapper}>
                  <AppIcon.Transactions width={36} height={36} color={theme.colors.text.tertiary} />
                </View>
                <Text style={styles.emptyTitle}>No transactions yet</Text>
                <Text style={styles.emptySubtitle}>
                  Your transaction history will appear here once you start using credits
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={handleBuyCredits}>
                  <Text style={styles.emptyButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default WalletScreen;
