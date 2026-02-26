import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { SelectedMaterialsModalProps } from './@types';
import { createStyles } from './styles';

const AGENT_TYPE_LABELS: Record<string, string> = {
  AUTHORIZED_AGENT: 'Authorized Agent',
  INDEPENDENT_DEALER: 'Independent Dealer',
};

const MODAL_HEIGHT_RATIO = 0.85;

export const SelectedMaterialsModal: React.FC<SelectedMaterialsModalProps> = ({
  visible,
  onClose,
  selectedMaterials,
  onRemove,
}) => {
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const styles = createStyles(theme);
  const modalContentHeight = Math.round(windowHeight * MODAL_HEIGHT_RATIO);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { height: modalContentHeight }]}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
              Selected Materials
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <AppIcon.Close
                width={24}
                height={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {selectedMaterials.map(([key, material]) => {
              const thicknessText =
                material.thicknessRanges && material.thicknessRanges.length > 0
                  ? material.thicknessRanges
                      .map(
                        r => `${r.min}–${r.max} ${r.unit}`,
                      )
                      .join(', ')
                  : '—';
              const finishesText =
                material.finishNames && material.finishNames.length > 0
                  ? material.finishNames.join(', ')
                  : 'None';
              const brandText = material.brandName
                ? material.brandName
                : material.brandId === null
                  ? 'Prefer not to disclose'
                  : '—';
              const agentText = material.agentType
                ? AGENT_TYPE_LABELS[material.agentType] ?? material.agentType
                : '—';

              return (
                <View key={key} style={styles.materialCard}>
                  <View style={styles.materialCardHeader}>
                    <Text
                      variant="bodyMedium"
                      fontWeight="semibold"
                      style={styles.materialCardTitle}
                    >
                      {material.materialName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onRemove(key)}
                      style={styles.removeButton}
                      activeOpacity={0.7}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.error.DEFAULT, fontSize: 18 }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="captionMedium" style={styles.detailLabel}>
                      Thickness:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {thicknessText}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="captionMedium" style={styles.detailLabel}>
                      Finishes:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {finishesText}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="captionMedium" style={styles.detailLabel}>
                      Brand:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {brandText}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="captionMedium" style={styles.detailLabel}>
                      Agent type:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {agentText}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
