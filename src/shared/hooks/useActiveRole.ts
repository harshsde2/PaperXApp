import { useAppSelector } from '@store/hooks';
import { useGetProfile } from '@services/api';
import { UserRole as NavigationUserRole } from '@navigation/constants';
import { UserRole as SharedUserRole } from '@shared/types';

/**
 * Convert shared UserRole format (machineDealer) to navigation format (machine-dealer)
 */
const convertToNavigationRole = (role: SharedUserRole | string): NavigationUserRole => {
  if (typeof role === 'string') {
    const normalized = role.toLowerCase().replace(/\s+/g, '-');
    // Convert "machineDealer" or "machine-dealer" to "machine-dealer"
    if (normalized === 'machinedealer' || normalized === 'machine-dealer') {
      return 'machine-dealer';
    }
    // Map other roles
    const roleMap: Record<string, NavigationUserRole> = {
      'dealer': 'dealer',
      'converter': 'converter',
      'brand': 'brand',
    };
    return roleMap[normalized] || 'dealer';
  }
  
  // Handle SharedUserRole enum
  if (role === 'machineDealer') {
    return 'machine-dealer';
  }
  return role as NavigationUserRole;
};

/**
 * Hook to get the currently active role in navigation format
 * Falls back to primary role from profile or user data if activeRole is not set
 */
export const useActiveRole = (): NavigationUserRole => {
  const { activeRole, primaryRole } = useAppSelector((state) => state.role);
  const { data: profileData } = useGetProfile();
  const { user } = useAppSelector((state) => state.auth);

  // Priority: activeRole > roleSlice primaryRole > profileData primary_role > user primaryRole > 'dealer'
  if (activeRole) {
    return convertToNavigationRole(activeRole);
  }

  if (primaryRole) {
    return convertToNavigationRole(primaryRole);
  }

  const profileRole = profileData?.primary_role;
  if (profileRole) {
    return convertToNavigationRole(profileRole);
  }

  const userRole = user?.primaryRole;
  if (userRole) {
    return convertToNavigationRole(userRole);
  }

  return 'dealer';
};
