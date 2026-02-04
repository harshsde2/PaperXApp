/**
 * MatchResponseCard Component
 * Displays a supplier's response to a session requirement
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { MatchResponse } from '../../@types';
import { MatchResponseCardProps } from './@types';
import { createStyles } from './styles';

export const MatchResponseCard: React.FC<MatchResponseCardProps> = ({
  response,
  onChat,
  onShortlist,
  onReject,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleChat = useCallback(() => {
    onChat(response);
  }, [response, onChat]);

  const handleShortlist = useCallback(() => {
    onShortlist(response);
  }, [response, onShortlist]);

  const handleReject = useCallback(() => {
    onReject(response);
  }, [response, onReject]);

  const getMatchBadgeStyles = () => {
    switch (response.matchType) {
      case 'exact_match':
        return {
          badge: styles.matchBadgeExact,
          text: styles.matchBadgeTextExact,
          label: 'Exact Match',
        };
      case 'slight_variation':
        return {
          badge: styles.matchBadgeVariation,
          text: styles.matchBadgeTextVariation,
          label: 'Slight Variation',
        };
      case 'nearest':
        return {
          badge: styles.matchBadgeNearest,
          text: styles.matchBadgeTextNearest,
          label: 'Nearest',
        };
      default:
        return {
          badge: styles.matchBadgeVariation,
          text: styles.matchBadgeTextVariation,
          label: 'Match',
        };
    }
  };

  const matchStyles = getMatchBadgeStyles();
  const hasResponded = response.hasResponded ?? true; // Default to true for backward compatibility

  return (
    <View style={[
      styles.card, 
      response.isShortlisted && styles.cardShortlisted,
      !hasResponded && { opacity: 0.85 },
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.supplierInfo}>
          <View
            style={[
              styles.supplierLogo,
              response.matchType === 'slight_variation' && styles.supplierLogoSlightVariation,
              !hasResponded && { backgroundColor: theme.colors.background.tertiary },
            ]}
          >
            <AppIcon.Organization
              width={20}
              height={20}
              color={
                response.matchType === 'exact_match'
                  ? theme.colors.primary.DEFAULT
                  : theme.colors.text.tertiary
              }
            />
          </View>
          <View style={styles.supplierDetails}>
            <View style={styles.supplierNameRow}>
              <Text style={styles.supplierName} numberOfLines={1}>
                {response.supplierName}
              </Text>
              {response.isVerified && (
                <AppIcon.TickCheckedBox
                  width={16}
                  height={16}
                  color={theme.colors.primary.DEFAULT}
                />
              )}
              {/* Response Status Badge */}
              {!hasResponded && (
                <View style={{
                  backgroundColor: theme.colors.warning.background,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  marginLeft: 6,
                }}>
                  <Text style={{
                    fontSize: 10,
                    color: theme.colors.warning.DEFAULT,
                    fontWeight: '600',
                  }}>PENDING</Text>
                </View>
              )}
            </View>
            <View style={styles.locationRow}>
              <AppIcon.Location width={12} height={12} color={theme.colors.text.tertiary} />
              <Text style={styles.locationText}>
                {response.location.distance} • {response.location.city}, {response.location.country}
              </Text>
            </View>
          </View>
        </View>

        {/* Match Badge */}
        <View style={[styles.matchBadge, matchStyles.badge]}>
          <Text style={[styles.matchBadgeText, matchStyles.text]}>{matchStyles.label}</Text>
        </View>
      </View>

      {/* Message / Match Score */}
      <Text style={[styles.message, !hasResponded && { fontStyle: 'italic' }]} numberOfLines={3}>
        {hasResponded ? `"${response.message}"` : response.message}
      </Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.chatButton]}
          onPress={handleChat}
          activeOpacity={0.7}
          disabled={!hasResponded}
        >
          <AppIcon.Messages width={18} height={18} color={hasResponded ? theme.colors.text.primary : theme.colors.text.disabled} />
          <Text style={[styles.actionButtonText, styles.chatButtonText, !hasResponded && { color: theme.colors.text.disabled }]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            response.isShortlisted ? styles.shortlistedButton : styles.shortlistButton,
          ]}
          onPress={handleShortlist}
          activeOpacity={0.7}
        >
          <AppIcon.TickCheckedBox
            width={18}
            height={18}
            color={response.isShortlisted ? '#16A34A' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionButtonText,
              response.isShortlisted ? styles.shortlistedButtonText : styles.shortlistButtonText,
            ]}
          >
            {response.isShortlisted ? 'Shortlisted' : 'Shortlist'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <AppIcon.Close width={18} height={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MatchResponseCard;
