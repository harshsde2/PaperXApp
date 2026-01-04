import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { useLogout } from '@services/api';
import { storageService } from '@services/storage/storageService';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { Section } from '@shared/components/Section';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { CustomHeader } from '@shared/components/CustomHeader';
import { ProfileScreenNavigationProp } from './@types';
import { styles } from './styles';
import type { UserProfile } from '@services/api/types';
import { AppIcon } from '@assets/svgs';

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const { user } = useAppSelector((state) => state.auth);
  const logoutMutation = useLogout();
  
  // Get user data from storage (may have more fields than Redux)
  const storedUserData = storageService.getUserData<UserProfile>();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleEdit = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile');
  };

  // Set header options with Edit button
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <CustomHeader
          {...props}
          rightButton={{
            icon: <Text style={styles.editButtonText}>Edit</Text>,
            onPress: handleEdit,
          }}
        />
      ),
    });
  }, [navigation, handleEdit]);

  const handleAccountSettings = () => {
    // TODO: Navigate to account settings
    console.log('Account settings');
  };

  const handleManageRoles = () => {
    // TODO: Navigate to manage roles
    console.log('Manage roles');
  };

  const handleHelpSupport = () => {
    // TODO: Navigate to help & support
    console.log('Help & support');
  };

  // Get display values from stored user data or Redux user
  const companyName = storedUserData?.company_name || 'Company Name';
  const email = storedUserData?.email || 'email@example.com';
  const mobile = user?.mobile || storedUserData?.mobile || '';
  const contactPerson = storedUserData?.email?.split('@')[0] || 'Contact Person';
  const location = storedUserData?.location 
    ? `${storedUserData.location.city}, ${storedUserData.location.state}, ${storedUserData.location.pincode}`
    : 'Location';

  return (
    <ScreenWrapper
      scrollable
      backgroundColor="#F5F5F5"
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Card */}
      <Card style={styles.profileCardContainer}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageIcon}>📦</Text>
            <Text style={styles.profileImageText}>COMPANY</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedCheckmark}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.supplierType}>Premium Supplier</Text>
        
        <TouchableOpacity style={styles.activeButton}>
          <Text style={styles.activeButtonText}>ACTIVE</Text>
        </TouchableOpacity>
      </Card>

      {/* Contact Information */}
      <Section
        title="Contact Information"
        style={styles.section}
      >
        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.PersonIcon width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Contact Person</Text>
            <Text style={styles.contactValue}>{contactPerson}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.EmailIcon width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{email}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.PhoneIcon width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Mobile</Text>
            <Text style={styles.contactValue}>{mobile}</Text>
          </View>
        </Card>

        <Card variant="compact" style={styles.contactItemContainer}>
          <AppIcon.Location width={24} height={24} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Location</Text>
            <Text style={styles.contactValue}>{location}</Text>
          </View>
        </Card>
      </Section>

      {/* Settings */}
      <Section
        title="Settings"
        style={styles.section}
      >
        <TouchableOpacity style={styles.settingsItem} onPress={handleAccountSettings}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>⚙️</Text>
            </View>
            <Text style={styles.settingsLabel}>Account Settings</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleManageRoles}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>👥</Text>
            </View>
            <Text style={styles.settingsLabel}>Manage Roles</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={handleHelpSupport}>
          <View style={styles.settingsItemLeft}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>❓</Text>
            </View>
            <Text style={styles.settingsLabel}>Help & Support</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </Section>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.logoutIcon}>→</Text>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.versionText}>v1.0.4</Text>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

