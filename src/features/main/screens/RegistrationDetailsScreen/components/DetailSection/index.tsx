import React, { memo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/hooks/useTheme';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { createStyles } from './styles';
import type { DetailSectionProps } from './@types';
import type { RegistrationRowVM } from '../../@types';

const getIcon = (name?: string | null) => {
  if (!name) return null;
  const map: Record<string, any> = {
    Building: AppIcon.Organization,
    Process: AppIcon.Process,
    Settings: AppIcon.Settings,
    Location: AppIcon.Location,
    Capacity: AppIcon.Capacity,
    Finishing: AppIcon.Finishing,
    Scrap: AppIcon.Scrap,
    Person: AppIcon.Person,
    Brand: AppIcon.Brand,
    Globe: AppIcon.Globe,
  };
  return map[name] || null;
};

export const DetailSection = memo(({ title, icon, rows }: DetailSectionProps) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const IconComp = getIcon(icon);

  const renderRow = (row: RegistrationRowVM, index: number) => {
    const isLast = index === rows.length - 1;

    switch (row.type) {
      case 'metric':
        return (
          <View key={row.id} style={[styles.metricRow, isLast && styles.valueRowLast]}>
            <Text style={styles.metricLabel}>{row.label}</Text>
            <Text style={styles.metricValue}>{row.value || '—'}</Text>
          </View>
        );

      case 'chip-list':
        return (
          <View key={row.id} style={styles.chipContainer}>
            {row.label ? <Text style={styles.chipLabel}>{row.label}</Text> : null}
            <View style={styles.chipRow}>
              {(row.chips ?? []).map((chip, ci) => (
                <View key={`${row.id}_chip_${ci}`} style={styles.chip}>
                  <Text style={styles.chipText}>{chip}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'address':
        return (
          <View key={row.id} style={[styles.addressRow, isLast && styles.valueRowLast]}>
            <Text style={styles.addressLabel}>{row.label}</Text>
            <Text style={styles.addressValue}>{row.value || '—'}</Text>
          </View>
        );

      case 'detail-card':
        return (
          <View key={row.id} style={[styles.detailCard, isLast && styles.valueRowLast]}>
            <Text style={styles.detailCardTitle}>{row.label}</Text>
            {row.value ? <Text style={styles.detailCardSubtitle}>{row.value}</Text> : null}
            {row.chips && row.chips.length > 0 ? (
              <View style={styles.detailChipRow}>
                {row.chips.map((c, ci) => (
                  <View key={`${row.id}_dc_${ci}`} style={styles.detailChip}>
                    <Text style={styles.detailChipText}>{c}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );

      default:
        return (
          <View key={row.id} style={[styles.valueRow, isLast && styles.valueRowLast]}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue} numberOfLines={3}>
              {row.value || '—'}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {IconComp ? (
          <View style={styles.iconWrap}>
            <IconComp width={16} height={16} color={theme.colors.primary.DEFAULT} />
          </View>
        ) : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.card}>{rows.map(renderRow)}</View>
    </View>
  );
});
