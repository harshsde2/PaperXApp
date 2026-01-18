import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CardProps } from './@types';
import { styles } from './styles';

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  testID,
  activeOpacity = 0.7,
}) => {
  const cardStyle = [
    styles.card,
    variant === 'compact' && styles.cardCompact,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, styles.cardPressable]}
        onPress={onPress}
        activeOpacity={activeOpacity}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

export default Card;

