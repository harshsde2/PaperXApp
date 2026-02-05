import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { setRoles } from '@store/slices/roleSlice';
import { storageService } from '@services/storage/storageService';
import AuthStackNavigator from './AuthStackNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  // Prefer backend-driven "registration complete" flags when available.
  // 1. has_completed_registration (backend explicit flag)
  // 2. profile_complete (backend aggregate flag)
  // 3. Fallback: presence of companyName
  const backendHasCompletedRegistration =
    typeof (user as any)?.has_completed_registration === 'boolean'
      ? (user as any).has_completed_registration
      : typeof (user as any)?.profile_complete === 'boolean'
        ? (user as any).profile_complete
        : undefined;

  const hasCompletedRegistration =
    typeof backendHasCompletedRegistration === 'boolean'
      ? backendHasCompletedRegistration
      : user?.companyName !== null && user?.companyName !== undefined;

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
          const primaryRole = userData.primary_role || userData.primaryRole;
          const secondaryRole = userData.secondary_role ?? userData.secondaryRole;
          const primaryNormalized = primaryRole === 'machine-dealer' ? 'machineDealer' : primaryRole;
          const secondaryNormalized = secondaryRole === 'machine-dealer' ? 'machineDealer' : secondaryRole;
          dispatch(
            setCredentials({
              user: {
                id: userData.user_id || userData.id || '',
                mobile: userData.mobile || '',
                primaryRole: primaryNormalized || primaryRole || '',
                secondaryRole: secondaryNormalized ?? secondaryRole,
                isVerified: userData.verified !== undefined ? userData.verified : true,
                companyName: userData.company_name || null,
                udyamVerifiedAt: userData.udyam_verified_at || null,
                ...userData,
              },
              token: token,
            })
          );
          if (primaryNormalized) {
            dispatch(
              setRoles({
                primaryRole: primaryNormalized as 'dealer' | 'converter' | 'brand' | 'machineDealer',
                secondaryRole: secondaryNormalized as 'dealer' | 'converter' | 'brand' | 'machineDealer' | undefined,
              })
            );
          }
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

