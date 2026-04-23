import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import type { IDashboardCardWrapperProps } from './@types';
import { createStyles } from './styles';

const DashboardCardWrapper: React.FC<IDashboardCardWrapperProps> = ({
  children,
  style,
  marginBottom: marginBottomProp,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const marginBottom = marginBottomProp ?? theme.spacing[20];

  return (
    <View style={[styles.container, { marginBottom }, style]}>{children}</View>
  );
};

export default DashboardCardWrapper;
