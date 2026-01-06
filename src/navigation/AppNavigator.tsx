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
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has completed registration (has company_name)
  const hasCompletedRegistration = user?.companyName !== null && user?.companyName !== undefined;
  
  // Check if UDYAM is verified (if verified, go to dashboard)
  const isUdyamVerified = user?.udyamVerifiedAt !== null && user?.udyamVerifiedAt !== undefined;

  // Debug log for auth state changes
  useEffect(() => {
    console.log('[AppNavigator] Auth state changed:', {
      isAuthenticated,
      isLoading,
      hasCompletedRegistration,
      isUdyamVerified,
      companyName: user?.companyName,
      udyamVerifiedAt: user?.udyamVerifiedAt,
    });
  }, [isAuthenticated, isLoading, hasCompletedRegistration, isUdyamVerified, user?.companyName, user?.udyamVerifiedAt]);

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
                companyName: userData.company_name || null,
                udyamVerifiedAt: userData.udyam_verified_at || null,
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

  // Show MainNavigator if:
  // 1. User is authenticated AND
  // 2. User has completed registration (has company_name)
  // Note: UDYAM verification can be completed later from the dashboard/profile screen
  // If user doesn't have company_name, they'll be redirected to CompanyDetails screen
  // from OTPVerificationScreen.
  const shouldShowMainNavigator = isAuthenticated && hasCompletedRegistration;

  return (
    <NavigationContainer>
      {shouldShowMainNavigator ? <MainNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

