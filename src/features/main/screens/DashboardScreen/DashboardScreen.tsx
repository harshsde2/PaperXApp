import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/hooks';
import { Text } from '@shared/components/Text';
import { MainStackParamList } from '@navigation/MainNavigator';
import { styles } from './styles';

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={handleProfilePress}
        >
          <Text style={styles.profileButtonIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      
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
    </View>
  );
};

export default DashboardScreen;

