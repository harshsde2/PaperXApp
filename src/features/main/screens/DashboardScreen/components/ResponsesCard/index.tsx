import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetActiveSessions } from '@services/api';
import type { ActiveSessionListItem } from '@services/api';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';
import type { ResponsesCardProps } from './@types';

/**
 * Surfaces "you have X responses" on the dashboard for any role.
 * Lists the poster's own active inquiries that have received responses; tapping
 * a row opens that post's responder list (→ chat), so the poster reaches a
 * conversation in 2 taps. Renders nothing when there are no responses.
 */
export const ResponsesCard: React.FC<ResponsesCardProps> = ({ style }) => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data } = useGetActiveSessions({ filter: 'all', per_page: 50 });

  const ownWithResponses = useMemo(() => {
    const sessions = (data?.data ?? []) as ActiveSessionListItem[];
    return sessions
      .filter((s) => s.is_owner === true && (s.responses_received ?? 0) > 0)
      .sort((a, b) => (b.responses_received ?? 0) - (a.responses_received ?? 0));
  }, [data]);

  const totalResponses = useMemo(
    () => ownWithResponses.reduce((sum, s) => sum + (s.responses_received ?? 0), 0),
    [ownWithResponses],
  );

  if (ownWithResponses.length === 0) {
    return null;
  }

  const topItems = ownWithResponses.slice(0, 3);

  const openResponders = (item: ActiveSessionListItem) => {
    navigation.navigate(SCREENS.SESSIONS.INQUIRY_CHAT_THREADS, {
      inquiryId: String(item.inquiry_id),
      inquiryTitle: item.title,
    });
  };

  const openAllResponses = () => {
    navigation.navigate(SCREENS.MAIN.RESPONSES);
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="h6" fontWeight="bold" size={16} color={theme.colors.text.primary}>
            Responses
          </Text>
          <View style={styles.countBadge}>
            <Text fontWeight="bold" size={12} color={theme.colors.white}>
              {totalResponses > 99 ? '99+' : totalResponses}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={openAllResponses} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text fontWeight="semibold" size={13} color={theme.colors.primary.DEFAULT}>
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {topItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => openResponders(item)}
        >
          <View style={styles.rowIcon}>
            <AppIcon.Messages width={18} height={18} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.rowContent}>
            <Text fontWeight="semibold" size={14} color={theme.colors.text.primary} numberOfLines={1}>
              {item.title || 'Your requirement'}
            </Text>
            <Text
              fontWeight="semibold"
              size={12}
              color={theme.colors.primary.DEFAULT}
              numberOfLines={1}
              style={styles.rowSubtitle}
            >
              {item.responses_received} {item.responses_received === 1 ? 'response' : 'responses'}
            </Text>
          </View>
          <AppIcon.ChevronRight width={18} height={18} color={theme.colors.text.disabled} />
        </TouchableOpacity>
      ))}
    </View>
  );
};
