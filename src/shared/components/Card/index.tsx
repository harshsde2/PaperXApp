import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CardProps } from './@types';
import { styles } from './styles';

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  testID,
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
        activeOpacity={0.7}
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

