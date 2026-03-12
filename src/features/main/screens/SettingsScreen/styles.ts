import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';
import { fontWeightForPlatform } from '@shared/utils/fontWeightForPlatform';
import {
  getHeadingStyle,
  getBodyStyle,
  getCaptionStyle,
} from '../DashboardScreen/components/sharedDashboardStyles';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    title: {
      ...getHeadingStyle(theme, 'h4'),
      fontSize: theme.typography.heading.h2.fontSize,
      fontWeight: fontWeightForPlatform('700'),
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: theme.spacing[5],
      paddingBottom: theme.spacing[10],
    },
    section: {
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      ...getCaptionStyle(theme, 'small'),
      fontWeight: fontWeightForPlatform('600'),
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[3],
      marginLeft: theme.spacing[1],
    },
    sectionContent: {
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.card.lg,
      overflow: 'hidden',
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.card.md ?? 10,
      backgroundColor: theme.colors.surface.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[4],
    },
    iconContainerDanger: {
      backgroundColor: theme.colors.error[50] ?? theme.colors.error.light,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      ...getBodyStyle(theme, 'medium'),
      fontWeight: fontWeightForPlatform('500'),
      color: theme.colors.text.primary,
    },
    settingTitleDanger: {
      color: theme.colors.error.DEFAULT,
    },
    settingSubtitle: {
      ...getBodyStyle(theme, 'small'),
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    },
    version: {
      textAlign: 'center',
      ...getCaptionStyle(theme, 'medium'),
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[5],
    },
    paletteSwatch: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.input.sm ?? 6,
    },
  });
