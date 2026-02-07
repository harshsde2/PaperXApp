/**
 * SessionDetailReceiverView
 * For the matched user (receiver): requirement summary, "Posted by", countdown, and Submit quote action.
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { RequirementSummaryCard } from '../../../components/RequirementSummaryCard';
import { SubmitQuoteModal } from './SubmitQuoteModal';
import { useSubmitQuote } from '@services/api';
import { createStyles } from '../styles';

export interface SessionDetailReceiverViewProps {
  summaryTitle: string;
  summarySubtitle: string;
  posterLabel: string;
  countdown: { hours: number; mins: number; secs: number } | null;
  inquiryId: number;
  sessionId: string | number;
  onQuoteSubmitted?: () => void;
  isLocked?: boolean;
}

export const SessionDetailReceiverView: React.FC<SessionDetailReceiverViewProps> = ({
  summaryTitle,
  summarySubtitle,
  posterLabel,
  countdown,
  inquiryId,
  sessionId,
  onQuoteSubmitted,
  isLocked = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  const submitQuote = useSubmitQuote();

  const handleOpenSubmit = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (!submitQuote.isPending) {
      setModalVisible(false);
    }
  }, [submitQuote.isPending]);

  const handleSubmitQuote = useCallback(
    (data: { quoted_price: number; delivery_days: number; notes?: string }) => {
      submitQuote.mutate(
        {
          inquiryId,
          sessionId,
          data: {
            quoted_price: data.quoted_price,
            delivery_days: data.delivery_days,
            currency: 'INR',
            notes: data.notes,
          },
        },
        {
          onSuccess: () => {
            setModalVisible(false);
            onQuoteSubmitted?.();
          },
        }
      );
    },
    [inquiryId, sessionId, submitQuote, onQuoteSubmitted]
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posterLine}>
          <Text style={styles.posterLineText}>Posted by {posterLabel}</Text>
        </View>
        <RequirementSummaryCard
          title={summaryTitle}
          subtitle={summarySubtitle}
          countdown={countdown ?? undefined}
        />
        {isLocked ? (
          <Text style={styles.receiverLockedText}>
            Bidding has ended for this requirement.
          </Text>
        ) : (
          <View style={styles.receiverActionSection}>
            <TouchableOpacity
              style={styles.receiverActionButton}
              onPress={handleOpenSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.receiverActionButtonText}>Submit my quote</Text>
              <AppIcon.ChevronRight width={20} height={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <SubmitQuoteModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuote}
        isSubmitting={submitQuote.isPending}
      />
    </>
  );
};
