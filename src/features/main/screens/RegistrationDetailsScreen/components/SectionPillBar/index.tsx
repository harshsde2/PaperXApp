import React, { memo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@theme/hooks/useTheme';
import { Text } from '@shared/components/Text';
import { createStyles } from './styles';
import type { SectionPillBarProps } from './@types';

export const SectionPillBar = memo(({ sections, activeId, onPress }: SectionPillBarProps) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onPress(s.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {s.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});
