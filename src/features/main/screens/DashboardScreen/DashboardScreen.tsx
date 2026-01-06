import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/hooks';
import { Text } from '@shared/components/Text';
import { MainStackParamList } from '@navigation/MainNavigator';
import { createStyles } from './styles';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { useTheme } from '@theme/index';

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const styles = createStyles(theme);
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScreenWrapper
    scrollable
    backgroundColor={theme.colors.background.secondary}
    safeAreaEdges={[]}
    contentContainerStyle={styles.scrollContent}
    
    >      
      <View style={styles.content}>
        <Text variant="h2" style={styles.welcomeText}>
          Welcome back!
        </Text>
        {user && (
          <View style={styles.userInfo}>
            <Text variant="bodyLarge" style={styles.userInfoText}>
              Mobile: {user.mobile}
            </Text>
            {user.primaryRole && (
              <Text variant="bodyMedium" style={styles.userInfoText}>
                Role: {user.primaryRole}
              </Text>
            )}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default DashboardScreen;

