/**
 * Theme Usage Examples
 * 
 * This file demonstrates how to use the theme system in components.
 * This is for reference only and can be deleted if not needed.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getStatusColor, getHeadingStyle, combineStyles } from '../utils/themeHelpers';

/**
 * Example: Basic theme usage
 */
export const BasicThemeExample = () => {
  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
      <Text style={[getHeadingStyle(theme, 1), { color: theme.colors.text.primary }]}>
        Welcome
      </Text>
      <Text style={{ ...theme.typography.body.medium, color: theme.colors.text.secondary }}>
        This is an example component using the theme system.
      </Text>
    </View>
  );
};

/**
 * Example: Using status colors
 */
export const StatusColorExample = () => {
  const theme = useTheme();

  const statuses: Array<'matching' | 'reviewing' | 'pending' | 'approved'> = [
    'matching',
    'reviewing',
    'pending',
    'approved',
  ];

  return (
    <View style={styles(theme).container}>
      {statuses.map((status) => (
        <View
          key={status}
          style={[
            styles(theme).statusBadge,
            { backgroundColor: getStatusColor(theme, status) },
          ]}
        >
          <Text style={{ ...theme.typography.caption.medium, color: theme.colors.text.inverse }}>
            {status.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
};

/**
 * Example: Button using theme
 */
export const ButtonExample = () => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles(theme).button,
        {
          backgroundColor: theme.colors.primary.DEFAULT,
          padding: theme.spacing[4],
          borderRadius: theme.borderRadius.button.md,
        },
      ]}
    >
      <Text style={{ ...theme.typography.button.medium, color: theme.colors.text.inverse }}>
        Click Me
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Example: Card using theme
 */
export const CardExample = () => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles(theme).card,
        {
          backgroundColor: theme.colors.surface.primary,
          padding: theme.spacing[6],
          borderRadius: theme.borderRadius.card.md,
          ...theme.shadows.card,
        },
      ]}
    >
      <Text style={{ ...theme.typography.heading.h3, color: theme.colors.text.primary }}>
        Card Title
      </Text>
      <Text style={{ ...theme.typography.body.medium, color: theme.colors.text.secondary }}>
        Card content goes here
      </Text>
    </View>
  );
};

// Styles helper function (pattern to use in actual components)
const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.primary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.badge,
      marginBottom: theme.spacing[2],
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.button,
    },
    card: {
      margin: theme.spacing[4],
    },
  });

