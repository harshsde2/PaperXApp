import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { ProductSpecsGridProps, SpecItem } from './@types';
import { createStyles } from './styles';

export const ProductSpecsGrid = memo<ProductSpecsGridProps>(
  function ProductSpecsGrid({ product }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const specs: SpecItem[] = useMemo(
      () =>
        [
          { label: 'Category', value: product.category },
          { label: 'Size', value: product.size },
          { label: 'Material', value: product.material },
          { label: 'GSM', value: product.gsm },
          { label: 'Finish', value: product.finish },
          { label: 'MOQ', value: String(product.moq) },
        ].filter((spec): spec is SpecItem => spec.value != null),
      [product],
    );

    return (
      <View style={styles.grid}>
        {specs.map((spec) => (
          <View key={spec.label} style={styles.cell}>
            <Text variant="captionMedium" style={styles.label}>
              {spec.label}
            </Text>
            <Text variant="bodySmall" fontWeight="bold" style={styles.value}>
              {spec.value}
            </Text>
          </View>
        ))}
      </View>
    );
  },
);
