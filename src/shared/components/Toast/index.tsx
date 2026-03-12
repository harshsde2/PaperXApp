import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import type { ToastBannerProps, ToastType } from './@types';
import { createStyles } from './styles';

const typeToTitle: Record<ToastType, string> = {
  success: 'Congratulations!',
  info: 'Did you know?',
  warning: 'Warning!',
  error: 'Something went wrong!',
};

const ToastBannerComponent: React.FC<ToastBannerProps> = ({
  type,
  title,
  message,
  onClose,
  rightContent,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const containerBackgroundStyle = useMemo(() => {
    switch (type) {
      case 'success':
        return styles.successBackground;
      case 'info':
        return styles.infoBackground;
      case 'warning':
        return styles.warningBackground;
      case 'error':
      default:
        return styles.errorBackground;
    }
  }, [type, styles]);

  const iconContainerStyle = useMemo(() => {
    switch (type) {
      case 'success':
        return styles.iconContainerSuccess;
      case 'info':
        return styles.iconContainerInfo;
      case 'warning':
        return styles.iconContainerWarning;
      case 'error':
      default:
        return styles.iconContainerError;
    }
  }, [type, styles]);

  const iconColor = theme.colors.white;

  const renderIcon = () => {
    if (type === 'success') {
      return (
        <AppIcon.TickCheckedBox
          width={18}
          height={18}
          color={iconColor}
        />
      );
    }

    if (type === 'warning') {
      return (
        <AppIcon.Warning
          width={18}
          height={18}
          color={iconColor}
        />
      );
    }

    if (type === 'info') {
      return (
        <AppIcon.Notification
          width={18}
          height={18}
          color={iconColor}
        />
      );
    }

    // error
    return (
      <AppIcon.Close
        width={18}
        height={18}
        color={iconColor}
      />
    );
  };

  const resolvedTitle = title || typeToTitle[type];

  return (
      <View style={[styles.container, containerBackgroundStyle]}>
      <View style={[styles.iconContainer, iconContainerStyle]}>{renderIcon()}</View>

      <View style={styles.content}>
        <Text
          variant="bodyMedium"
          fontWeight="semibold"
          style={[styles.title]}
        >
          {resolvedTitle}
        </Text>
        {message ? (
          <Text
            variant="captionMedium"
            style={styles.message}
          >
            {message}
          </Text>
        ) : null}
      </View>

      {rightContent ? (
        rightContent
      ) : onClose ? (
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={styles.closeButton}
        >
          <AppIcon.Close
            width={16}
            height={16}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export const ToastBanner = memo(ToastBannerComponent);

