import React, { useMemo } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { FeaturedNewsCardProps } from './@types';
import { createStyles } from './styles';

const formatArticleDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({
  article,
  categoryColor,
  onPress,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable style={styles.container} onPress={() => onPress(article)}>
      <View style={styles.imageWrapper}>
        {article.image_url ? (
          <Image
            source={{ uri: article.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[categoryColor, theme.colors.primary.dark]}
            style={styles.fallbackImage}
          >
            <Icon name="file-text" size={28} color={theme.colors.text.inverse} />
          </LinearGradient>
        )}

        <View style={styles.overlayActions}>
          <TouchableOpacity activeOpacity={0.8} style={styles.iconButton}>
            <Icon name="share-2" size={16} color={theme.colors.text.inverse} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.iconButton}>
            <Icon name="bookmark" size={16} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>

        <View style={[styles.categoryPill, { backgroundColor: categoryColor }]}>
          <Text variant="captionMedium" style={styles.categoryText}>
            {article.category}
          </Text>
        </View>
      </View>

      <Text variant="h6" numberOfLines={3} style={styles.title}>
        {article.title}
      </Text>

      <View style={styles.metaRow}>
        <Icon name="clock" size={14} color={theme.colors.text.secondary} />
        <Text variant="captionMedium" style={styles.metaText}>
          {formatArticleDate(article.published_at)}
        </Text>
      </View>
    </Pressable>
  );
};

export default FeaturedNewsCard;
