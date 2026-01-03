import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useLogout } from '@services/api';
import { Text } from '@shared/components/Text';
import { styles } from './styles';

const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text variant="buttonMedium" style={styles.logoutButtonText}>Logout</Text>
          )}
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

