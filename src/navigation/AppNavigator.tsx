import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { storageService } from '@services/storage/storageService';
import AuthStackNavigator from './AuthStackNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  // Debug log for auth state changes
  useEffect(() => {
    console.log('[AppNavigator] Auth state changed:', {
      isAuthenticated,
      isLoading,
    });
  }, [isAuthenticated, isLoading]);

  // Initialize auth state from storage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = storageService.getAuthToken();
        const userData = storageService.getUserData<any>();

        if (token && userData) {
          // Restore auth state from storage
          dispatch(
            setCredentials({
              user: {
                id: userData.user_id || userData.id || '',
                mobile: userData.mobile || '',
                primaryRole: userData.primary_role || userData.primaryRole || '',
                secondaryRole: userData.secondary_role || userData.secondaryRole,
                isVerified: userData.verified !== undefined ? userData.verified : true,
              },
              token: token,
            })
          );
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show nothing while checking auth state
  if (isLoading) {
    return null; // Or you can return a loading screen here
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

