/**
 * LegalModal — bottom-sheet style modal that renders the Terms & Conditions or
 * Privacy Policy content. Copy lives in ./content.ts.
 */

import React, { useMemo } from 'react';
import { Modal, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { LegalModalProps } from './@types';
import { createStyles } from './styles';
import { LEGAL_CONTENT } from './content';

export const LegalModal: React.FC<LegalModalProps> = ({ visible, docType, onClose }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const doc = useMemo(() => LEGAL_CONTENT[docType], [docType]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.title}>{doc.title}</Text>
              <Text style={styles.effectiveDate}>{doc.effectiveDate}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <AppIcon.Close width={16} height={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
          >
            {doc.sections.map((section) => (
              <View key={section.heading} style={styles.section}>
                <Text style={styles.sectionHeading}>{section.heading}</Text>

                {section.paragraphs?.map((paragraph, index) => (
                  <Text key={index} style={styles.paragraph}>
                    {paragraph}
                  </Text>
                ))}

                {section.bullets?.map((bullet, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{'•'}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing[3] }]}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.footerButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
