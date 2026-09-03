/**
 * ContactSupportScreen — shows how to reach Zupply support (phone + email).
 * Tapping a card opens the dialer (tel:) or the mail composer (mailto:).
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { Toast } from 'toastify-react-native';
import { createStyles } from './styles';

const SUPPORT_PHONE_DISPLAY = '+91 99695 08795';
const SUPPORT_PHONE_TEL = 'tel:+919969508795';
const SUPPORT_EMAIL = 'hello@zupply.in';

const ContactSupportScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const open = async (url: string, failText: string) => {
    try {
      // Open directly — canOpenURL is unreliable for tel:/mailto: (and false on
      // the simulator), so we just attempt and surface a toast if it fails.
      await Linking.openURL(url);
    } catch {
      Toast.show({ type: 'error', text1: failText, position: 'top' });
    }
  };

  return (
    <ScreenWrapper safeAreaEdges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <AppIcon.PhoneIcon width={32} height={32} color={theme.colors.primary.DEFAULT} />
          </View>
          <Text style={styles.title}>We're here to help</Text>
          <Text style={styles.subtitle}>
            Have a question or need assistance? Reach the Zupply support team and we'll get back to you as soon as possible.
          </Text>
        </View>

        {/* Call us */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => open(SUPPORT_PHONE_TEL, 'Could not open the dialer')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Call us: ${SUPPORT_PHONE_DISPLAY}`}
        >
          <View style={styles.cardIcon}>
            <AppIcon.PhoneIcon width={22} height={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardLabel}>Call us</Text>
            <Text style={styles.cardValue}>{SUPPORT_PHONE_DISPLAY}</Text>
          </View>
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        {/* Email us */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => open(`mailto:${SUPPORT_EMAIL}`, 'Could not open the mail app')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Email us: ${SUPPORT_EMAIL}`}
        >
          <View style={styles.cardIcon}>
            <AppIcon.EmailIcon width={22} height={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardLabel}>Email us</Text>
            <Text style={styles.cardValue}>{SUPPORT_EMAIL}</Text>
          </View>
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Support hours: Monday to Saturday, 10:00 AM – 6:00 PM IST.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ContactSupportScreen;
