import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { storageService } from '@services/storage/storageService';
import { SCREENS } from '@navigation/constants';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  danger?: boolean;
}

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    storageService.clearAuth();
    dispatch(logout());
  };

  const handleNavigateToProfile = () => {
    navigation.navigate(SCREENS.MAIN.PROFILE);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: <AppIcon.Person width={22} height={22} color="#6B7280" />,
          title: 'Profile Settings',
          subtitle: 'Manage your account details',
          type: 'navigation',
          onPress: handleNavigateToProfile,
        },
        {
          id: 'Registration Details',
          icon: <AppIcon.Security width={22} height={22} color="#6B7280" />,
          title: 'Registration Details',
          subtitle: 'Manage your registration details',
          type: 'navigation',
          // onPress: handleNavigateToRegistrationDetails,
        },
        // {
        //   id: 'notifications',
        //   icon: <AppIcon.Notification width={22} height={22} color="#6B7280" />,
        //   title: 'Push Notifications',
        //   type: 'toggle',
        //   value: notificationsEnabled,
        //   onPress: () => setNotificationsEnabled(!notificationsEnabled),
        // },
      ],
    },
    // {
    //   title: 'Preferences',
    //   items: [
    //     {
    //       id: 'darkMode',
    //       icon: <AppIcon.Globe width={22} height={22} color="#6B7280" />,
    //       title: 'Dark Mode',
    //       type: 'toggle',
    //       value: darkMode,
    //       onPress: () => setDarkMode(!darkMode),
    //     },
    //     {
    //       id: 'language',
    //       icon: <AppIcon.Globe width={22} height={22} color="#6B7280" />,
    //       title: 'Language',
    //       subtitle: 'English',
    //       type: 'navigation',
    //     },
    //   ],
    // },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <AppIcon.Warning width={22} height={22} color="#6B7280" />,
          title: 'Help Center',
          type: 'navigation',
        },
        {
          id: 'contact',
          icon: <AppIcon.Mail width={22} height={22} color="#6B7280" />,
          title: 'Contact Support',
          type: 'navigation',
        },
      ],
    },
    {
      title: '',
      items: [
        {
          id: 'logout',
          icon: <AppIcon.ArrowRight width={22} height={22} color="#EF4444" />,
          title: 'Log Out',
          type: 'action',
          danger: true,
          onPress: handleLogout,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, item.danger && styles.iconContainerDanger]}>
        {item.icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.danger && styles.settingTitleDanger]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
          thumbColor={item.value ? '#2563EB' : '#9CA3AF'}
        />
      )}
      {item.type === 'navigation' && (
        <AppIcon.ChevronRight width={20} height={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerDanger: {
    backgroundColor: '#FEE2E2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingTitleDanger: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 20,
  },
});

export default SettingsScreen;
