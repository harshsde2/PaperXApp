import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Skeleton } from '@shared/components/Skeleton';
import { useTheme } from '@theme/index';
import { createStyles } from './styles';

export const NewsCardSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Skeleton
        height={200}
        width="100%"
        borderRadius={theme.borderRadius.card.lg}
      />
      <View style={styles.titleRow}>
        <Skeleton height={18} width="80%" borderRadius={theme.borderRadius.input.sm} />
        <Skeleton height={18} width="64%" borderRadius={theme.borderRadius.input.sm} />
      </View>
      <View style={styles.metaRow}>
        <Skeleton height={12} width="34%" borderRadius={theme.borderRadius.input.sm} />
      </View>
    </View>
  );
};

export default NewsCardSkeleton;
