import React, { memo } from 'react';
import { View } from 'react-native';
import { SectionHeader } from '@shared/components/SectionHeader';
import { SectionProps } from './@types';
import { styles } from './styles';

const Section: React.FC<SectionProps> = ({
  title,
  actionText,
  titleStyle,
  onActionPress,
  children,
  style,
  contentContainerStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <SectionHeader
        title={title}
        titleStyle={titleStyle}
        actionText={actionText}
        onActionPress={onActionPress}
      />
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

export default memo(Section);

