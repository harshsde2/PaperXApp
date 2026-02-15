/**
 * SessionCard Component
 * Displays a session in the list with status-specific UI
 */

import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { Session } from '../../@types';
import { ElapsedTimer } from '../ElapsedTimer';
import { SessionCardProps } from './@types';
import { createStyles } from './styles';

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
  onViewMatches,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handlePress = useCallback(() => {
    onPress(session);
  }, [session, onPress]);

  const handleViewMatches = useCallback(() => {
    onViewMatches?.(session);
  }, [session, onViewMatches]);

  const progressPercent = useMemo(() => {
    if (session.totalExpectedResponses === 0) return 0;
    return (session.responsesReceived / session.totalExpectedResponses) * 100;
  }, [session.responsesReceived, session.totalExpectedResponses]);

  const formattedDate = useMemo(() => {
    const date = new Date(session.createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [session.createdAt]);

  const renderStatusBadge = () => {
    switch (session.status) {
      case 'active':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeActive]}>
            <AppIcon.Process width={14} height={14} color={theme.colors.primary.DEFAULT} />
            <Text style={[styles.statusText, styles.statusTextActive]}>Active</Text>
          </View>
        );
      case 'finding_matches':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeFinding]}>
            <AppIcon.Search width={14} height={14} color="#D97706" />
            <Text style={[styles.statusText, styles.statusTextFinding]}>Finding</Text>
          </View>
        );
      case 'locked':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeLocked]}>
            <AppIcon.Security width={14} height={14} color={theme.colors.text.tertiary} />
            <Text style={[styles.statusText, styles.statusTextLocked]}>Locked</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const isOwner = session.isOwner !== false;

  const renderContent = () => {
    // Receiver view: show "Respond" as primary action, no Responses Received
    if (!isOwner) {
      return (
        <>
          <ElapsedTimer
            startDate={session.createdAt}
            endDate={session.biddingEndsAt}
            label="Time since post"
          />
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Respond</Text>
              <AppIcon.ChevronRight width={18} height={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      );
    }

    switch (session.status) {
      case 'active':
        return (
          <>
            {/* Timer: elapsed from post toward 24h / backend end */}
            <ElapsedTimer
              startDate={session.createdAt}
              endDate={session.biddingEndsAt}
              label="Time since post"
            />
            
            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Responses Received</Text>
                <Text style={styles.progressValue}>
                  {session.responsesReceived}/{session.totalExpectedResponses}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progressPercent}%` }]}
                />
              </View>
            </View>

            {/* Action Button */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewMatches}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>View Matches</Text>
                <AppIcon.ChevronRight width={18} height={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        );

      case 'finding_matches':
        return (
          <>
            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Matching Suppliers</Text>
                <Text style={[styles.progressValue, { color: theme.colors.text.tertiary }]}>
                  {session.responsesReceived}/{session.totalExpectedResponses}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    styles.progressFillFinding,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>

            {/* Finding Status Row */}
            <View style={styles.findingSection}>
              <View style={styles.findingRow}>
                <View style={styles.findingLeft}>
                  <Text style={styles.findingLabel}>Time Left</Text>
                  <Text style={styles.findingText}>Searching...</Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonOutline, { flex: 0, paddingHorizontal: theme.spacing[4], height: 40 }]}
                  onPress={handleViewMatches}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionButtonText, styles.actionButtonTextOutline]}>View Matches</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'locked':
        return (
          <>
            {/* Locked Info */}
            <View style={styles.lockedSection}>
              <AppIcon.Warning width={18} height={18} color={theme.colors.text.tertiary} />
              <Text style={styles.lockedText}>
                Session period has ended. Evaluating {session.responsesReceived} responses.
              </Text>
            </View>

            {/* Action Button */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonLocked]}
                onPress={handlePress}
                activeOpacity={0.8}
              >
                <AppIcon.EyeOn width={18} height={18} color={theme.colors.text.secondary} />
                <Text style={[styles.actionButtonText, styles.actionButtonTextLocked]}>
                  Review Summary
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, session.status === 'locked' && styles.cardLocked]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            {!isOwner && (session.intent === 'sell' || session.intent === 'buy') && (
              <View style={[styles.urgentBadge, session.intent === 'sell' ? styles.postSellBadge : styles.postBuyBadge]}>
                <Text style={[styles.urgentText, { color: session.intent === 'sell' ? '#1D4ED8' : '#059669' }]}>
                  {session.intent === 'sell' ? 'Post to sell' : 'Post to buy'}
                </Text>
              </View>
            )}
            {session.isUrgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
            <Text style={styles.title} numberOfLines={2}>
              {session.title}
            </Text>
            <Text style={styles.subtitle}>
              {isOwner
                ? `Created ${formattedDate} • ${session.category}`
                : `Match for you • Posted by ${session.posterLabel ?? 'a supplier'}`}
            </Text>
          </View>
          {renderStatusBadge()}
        </View>
      </View>

      {/* Status-specific Content */}
      {renderContent()}
    </TouchableOpacity>
  );
};

export default SessionCard;
