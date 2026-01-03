import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { SectionHeaderProps } from './@types';
import { styles } from './styles';

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  titleStyle,
  onActionPress,
}) => {
  if (!title && !actionText) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="h3" style={[styles.title, titleStyle]}>
          {title}
        </Text>
      )}
      {actionText && (
        <TouchableOpacity onPress={onActionPress} disabled={!onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;

