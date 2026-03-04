import React, { memo, useCallback } from 'react';
import { View, Linking, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { ContactDetailsCardProps } from './@types';
import { createStyles } from './styles';

export const ContactDetailsCard = memo<ContactDetailsCardProps>(
  function ContactDetailsCard({ title, name, companyName, email, phone }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const handleCall = useCallback(() => {
      if (phone) Linking.openURL(`tel:${phone}`);
    }, [phone]);

    const handleEmail = useCallback(() => {
      if (email) Linking.openURL(`mailto:${email}`);
    }, [email]);

    const hasContact = Boolean(name || companyName || email || phone);
    if (!hasContact) return null;

    const rows: React.ReactNode[] = [];

    if (name || companyName) {
      rows.push(
        <View key="name" style={styles.row}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text variant="bodySmall" style={styles.infoValue}>
              {companyName || name}
            </Text>
          </View>
        </View>,
      );
    }

    if (phone) {
      rows.push(
        <View key="phone" style={styles.row}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📞</Text>
          </View>
          <Pressable style={styles.infoBlock} onPress={handleCall}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text variant="bodySmall" style={styles.tappableValue}>
              {phone}
            </Text>
          </Pressable>
        </View>,
      );
    }

    if (email) {
      rows.push(
        <View key="email" style={[styles.row, styles.lastRow]}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✉️</Text>
          </View>
          <Pressable style={styles.infoBlock} onPress={handleEmail}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text variant="bodySmall" style={styles.tappableValue}>
              {email}
            </Text>
          </Pressable>
        </View>,
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.header}>{title}</Text>
        {rows}
      </View>
    );
  },
);
