import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { useNavigationHelpers } from '@navigation/helpers';
import { styles } from '../styles';
import { useTheme } from '@theme/index';

interface ProfileCompletionCardProps {
  incompleteFields: string[];
  completionPercentage: number;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  incompleteFields,
  completionPercentage,
}) => {
  const nav = useNavigationHelpers();
  const theme = useTheme();
  const handleCompleteProfile = () => {
    nav.navigate(SCREENS.MAIN.PROFILE);
  };

  return (
    <View style={styles.profileCompletionContainer}>
      <View style={styles.profileCompletionCardWrapper}>
        {/* Header with Icon */}
        <View style={styles.profileCompletionHeader}>
          <View style={styles.profileCompletionIconContainer}>
            <AppIcon.Person width={24} height={24} />
          </View>
          <View style={styles.profileCompletionHeaderText}>
            <Text variant="h5" fontWeight="bold" color="#000000">
              Complete Your Profile
            </Text>
          </View>
        </View>

        {/* Subheading */}
        <Text 
          variant="bodyMedium" 
          color="#666666" 
          style={styles.profileCompletionSubheading}
        >
          {completionPercentage < 100 
            ? `Your profile is ${completionPercentage}% complete. Complete it to unlock all features.`
            : 'Your profile is complete!'}
        </Text>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.profileCompletionButton}
          onPress={handleCompleteProfile}
          activeOpacity={0.8}
        >
          <Text 
            variant="buttonMedium" 
            fontWeight="semibold" 
            color="#FFFFFF"
            style={styles.profileCompletionButtonText}
          >
            Complete Profile
          </Text>
          <AppIcon.ArrowRight color={theme.colors.text.inverse} width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
