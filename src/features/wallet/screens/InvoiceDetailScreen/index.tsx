import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { AppIcon } from '@assets/svgs';
import { useGetInvoiceDetail } from '@services/api';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { DetailSkeleton } from '@shared/components/skeletons';
import type { InvoiceDetailRouteParams } from './@types';
import { createStyles } from './styles';

const formatDateTime = (iso: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ', ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
};

const formatInr = (value: number): string =>
  `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const InvoiceDetailScreen = () => {
  const route = useRoute();
  const { invoiceKey } = (route.params ?? {}) as InvoiceDetailRouteParams;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: invoice, isLoading, isError, refetch } = useGetInvoiceDetail(invoiceKey);
  const showSkeleton = useSkeleton(isLoading && !invoice);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      // Signed URLs expire — always refetch to get a fresh one before opening.
      const fresh = await refetch();
      const url = fresh.data?.download_url ?? invoice?.download_url;
      if (!url) {
        throw new Error('Download link unavailable');
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Download failed',
        'Could not open the invoice PDF. Please check your connection and try again.',
      );
    } finally {
      setIsDownloading(false);
    }
  }, [refetch, invoice?.download_url]);

  if (showSkeleton) {
    return (
      <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.skeletonContainer}>
          <DetailSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !invoice) {
    return (
      <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
        <View style={styles.centered}>
          <AppIcon.Warning width={48} height={48} color={theme.colors.text.disabled} />
          <Text style={styles.errorTitle}>Couldn't load invoice</Text>
          <Text style={styles.errorSubtitle}>
            Please check your connection and try again.
          </Text>
          <CustomButton
            title="Retry"
            onPress={() => refetch()}
            variant="primary"
            size="md"
            style={styles.retryButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const showGst = invoice.gst_amount_inr > 0;
  const billToName = invoice.bill_to.company_name || invoice.bill_to.name || '—';
  const billToLocation = [invoice.bill_to.city, invoice.bill_to.state]
    .filter(Boolean)
    .join(', ');

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.secondary}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.card}>
          <View style={styles.heroTop}>
            <Text style={styles.invoiceNo}>{invoice.invoice_no}</Text>
            <View style={styles.paidChip}>
              <Text style={styles.paidChipText}>PAID</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{invoice.title}</Text>
          <Text style={styles.heroDate}>{formatDateTime(invoice.paid_at)}</Text>
        </View>

        {/* Amounts */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{invoice.title}</Text>
            <Text style={styles.rowValue}>{formatInr(invoice.base_amount_inr)}</Text>
          </View>
          {invoice.credits !== null && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Credits added</Text>
              <Text style={styles.rowValue}>
                {invoice.credits.toLocaleString('en-IN')} Credits
              </Text>
            </View>
          )}
          {showGst && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>GST ({invoice.gst_percent}%)</Text>
              <Text style={styles.rowValue}>{formatInr(invoice.gst_amount_inr)}</Text>
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatInr(invoice.total_inr)}</Text>
          </View>
        </View>

        {/* Payment details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment method</Text>
            <Text style={styles.rowValue}>Razorpay</Text>
          </View>
          {invoice.razorpay_payment_id ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Payment ID</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {invoice.razorpay_payment_id}
              </Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Receipt</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {invoice.receipt}
            </Text>
          </View>
        </View>

        {/* Bill to */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {billToName}
            </Text>
          </View>
          {billToLocation ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Location</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {billToLocation}
              </Text>
            </View>
          ) : null}
          {invoice.bill_to.gstin ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>GSTIN</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {invoice.bill_to.gstin}
              </Text>
            </View>
          ) : null}
        </View>

        <CustomButton
          title="Download Invoice (PDF)"
          onPress={handleDownload}
          variant="gradient"
          size="lg"
          fullWidth
          loading={isDownloading}
          style={styles.downloadButton}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default InvoiceDetailScreen;
