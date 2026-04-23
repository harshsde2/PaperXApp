import React, { useMemo } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { StandardNewsCardProps } from './@types';
import { createStyles } from './styles';

const formatArticleDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const StandardNewsCard: React.FC<StandardNewsCardProps> = ({
  article,
  categoryColor,
  onPress,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable onPress={() => onPress(article)}>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          {article.image_url ? (
            <Image source={{ uri: article.image_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[categoryColor, theme.colors.surface.tertiary]}
              style={styles.image}
            >
              <View style={styles.fallbackCenter}>
                <Icon name="file-text" size={20} color={theme.colors.text.inverse} />
              </View>
            </LinearGradient>
          )}
        </View>
        <View style={styles.details}>
          <Text variant="bodySmall" numberOfLines={2} style={styles.title}>
            {article.title}
          </Text>
          <Text variant="captionMedium" numberOfLines={1} style={styles.source}>
            {article.source}
          </Text>
          <Text variant="captionSmall" style={styles.date}>
            {formatArticleDate(article.published_at)}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.trailingAction}>
          <Icon name="bookmark" size={14} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
    </Pressable>
  );
};

export default StandardNewsCard;
