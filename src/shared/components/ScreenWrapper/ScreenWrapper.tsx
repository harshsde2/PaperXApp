import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme';
import { ScreenWrapperProps, PaddingValue } from './@types';
import { styles } from './styles';

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  safeArea = true,
  safeAreaEdges = ['top', 'bottom', 'left', 'right'],
  padding,
  paddingHorizontal,
  paddingVertical,
  scrollable = false,
  scrollViewProps,
  contentContainerStyle,
  backgroundColor,
  backgroundElement,
  statusBarStyle = 'default',
  statusBarHidden = false,
  contentStyle,
  flex = 1,
  loading = false,
  loadingComponent,
  style,
}) => {
  const theme = useTheme();

  const resolvedBackgroundColor = backgroundColor || theme.colors.background.primary;

  const resolvedPadding = useMemo(() => {
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingBottom: padding,
        paddingLeft: padding,
        paddingRight: padding,
      };
    } else if (typeof padding === 'object') {
      return {
        paddingTop: padding.top ?? padding.vertical,
        paddingBottom: padding.bottom ?? padding.vertical,
        paddingLeft: padding.left ?? padding.horizontal,
        paddingRight: padding.right ?? padding.horizontal,
      };
    }
    return {};
  }, [padding]);

  const paddingStyle: ViewStyle = {
    ...resolvedPadding,
    ...(paddingHorizontal !== undefined && {
      paddingHorizontal,
    }),
    ...(paddingVertical !== undefined && {
      paddingVertical,
    }),
  };

  const containerStyle: ViewStyle = {
    flex,
    backgroundColor: resolvedBackgroundColor,
    ...style,
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[paddingStyle, contentStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[paddingStyle, contentStyle]}>
        {children}
      </View>
    );
  };

  const Wrapper = safeArea ? SafeAreaView : View;
  const edges = safeArea ? safeAreaEdges : undefined;

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        hidden={statusBarHidden}
        backgroundColor={resolvedBackgroundColor}
      />
      <Wrapper
        style={containerStyle}
        edges={edges}
      >
        {backgroundElement}
        {renderContent()}
        {loading && (
          <View style={styles.loadingOverlay}>
            {loadingComponent || (
              <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
            )}
          </View>
        )}
      </Wrapper>
    </>
  );
};

export default ScreenWrapper;

