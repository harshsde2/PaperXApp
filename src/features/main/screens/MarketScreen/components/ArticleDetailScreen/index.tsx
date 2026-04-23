import React, { useCallback, useMemo } from 'react';
import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { CustomButton } from '@shared/components/CustomButton';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { getCategoryColor } from '../../@types';
import type { ArticleDetailScreenProps } from './@types';
import { createStyles } from './styles';

const VERIFIED_SOURCE_MATCHERS = [
  /paper/i,
  /pulp/i,
  /reuters/i,
  /bloomberg/i,
  /financial/i,
];

const isVerifiedSource = (source: string): boolean =>
  VERIFIED_SOURCE_MATCHERS.some((matcher) => matcher.test(source));

const formatArticleDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { article } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const categoryColor = useMemo(
    () => getCategoryColor(theme, article.category),
    [theme, article.category],
  );

  const sourceInitial = article.source?.trim()?.charAt(0)?.toUpperCase() || 'N';
  const isVerified = isVerifiedSource(article.source || '');

  const handleOpenArticle = useCallback(async () => {
    if (!article.url) {
      return;
    }

    const canOpen = await Linking.canOpenURL(article.url);
    if (canOpen) {
      await Linking.openURL(article.url);
    }
  }, [article.url]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          {article.image_url ? (
            <Image source={{ uri: article.image_url }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[categoryColor, theme.colors.primary.dark]}
              style={styles.heroFallback}
            >
              <Icon name="file-text" size={40} color={theme.colors.text.inverse} />
            </LinearGradient>
          )}

          <LinearGradient
            colors={['transparent', theme.colors.background.overlay]}
            style={styles.heroOverlay}
          />

          <View style={[styles.floatingActions, { top: insets.top + theme.spacing[2] }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={18} color={theme.colors.text.inverse} />
            </TouchableOpacity>
            <View style={styles.actionButtonsRight}>
              <TouchableOpacity activeOpacity={0.8} style={styles.actionButton}>
                <Icon name="bookmark" size={16} color={theme.colors.text.inverse} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.actionButton}>
                <Icon name="more-horizontal" size={16} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.categoryPill, { backgroundColor: categoryColor }]}>
            <Text variant="captionMedium" style={styles.categoryText}>
              {article.category}
            </Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text variant="h3" style={styles.title}>
            {article.title}
          </Text>

          <View style={styles.metaRow}>
            <Icon name="clock" size={14} color={theme.colors.text.secondary} />
            <Text variant="captionMedium" style={styles.metaText}>
              {formatArticleDate(article.published_at)}
            </Text>
          </View>

          <View style={styles.sourceRow}>
            <View style={styles.sourceAvatar}>
              <Text variant="captionMedium" style={styles.sourceAvatarText}>
                {sourceInitial}
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.sourceName} numberOfLines={1}>
              {article.source}
            </Text>
            {isVerified ? (
              <View style={styles.verifiedIcon}>
                <Icon name="check" size={11} color={theme.colors.text.inverse} />
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          <Text variant="bodyMedium" style={styles.summary}>
            {article.summary || 'Summary is currently unavailable for this article.'}
          </Text>

          <View style={styles.ctaWrapper}>
            <CustomButton
              title="Read Full Article"
              variant="primary"
              size="md"
              fullWidth
              onPress={handleOpenArticle}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ArticleDetailScreen;
