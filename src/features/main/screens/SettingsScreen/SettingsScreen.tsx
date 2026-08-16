import React from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/components/Text';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { AppIcon } from '@assets/svgs';
import { useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { storageService } from '@services/storage/storageService';
import { unregisterCurrentDeviceToken } from '@services/api/deviceTokenApi';
import { useTheme, useThemeContext, themePalettes } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import type { ThemePaletteId } from '@theme/index';
import { createStyles } from './styles';

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

const PALETTE_OPTIONS: { id: ThemePaletteId; label: string }[] = [
  { id: 'base', label: 'Blue' },
  { id: 'slate', label: 'Slate' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'forest', label: 'Forest' },
  { id: 'navy', label: 'Navy' },
  { id: 'violet', label: 'Violet' },
];

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeContext = useThemeContext();
  const styles = createStyles(theme);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Unregister this device's push token before the bearer is cleared.
      await unregisterCurrentDeviceToken();
    } catch {
      // Ignore token-unregister failures; still proceed with logout.
    } finally {
      storageService.clearAuth();
      dispatch(logout());
    }
  };

  const handleNavigateToProfile = () => {
    navigation.navigate(SCREENS.MAIN.PROFILE);
  };

  const handleNavigateToRegistrationDetails = () => {
    navigation.navigate(SCREENS.MAIN.REGISTRATION_DETAILS);
  };

  const handleWalletPress = () => {
    navigation.navigate(SCREENS.WALLET.MAIN);
  };

  const handleInvoicesPress = () => {
    navigation.navigate(SCREENS.INVOICES.LIST);
  };

  const settingsSections = [
    // ...(themeContext
    //   ? [
    //       {
    //         title: 'Appearance',
    //         items: PALETTE_OPTIONS.map((p) => ({
    //             id: `palette-${p.id}`,
    //             icon: (
    //               <View
    //                 style={[
    //                   styles.paletteSwatch,
    //                   { backgroundColor: themePalettes[p.id].blue500 },
    //                 ]}
    //               />
    //             ),
    //             title: p.label,
    //             type: 'navigation' as const,
    //             onPress: () => themeContext.setPalette(p.id),
    //             isSelected: themeContext.paletteId === p.id,
    //           })),
    //       },
    //     ]
    //   : []),
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: <AppIcon.Person width={22} height={22} color={theme.colors.text.secondary} />,
          title: 'Profile Settings',
          subtitle: 'Manage your account details',
          type: 'navigation',
          onPress: handleNavigateToProfile,
        },
        {
          id: 'Registration Details',
          icon: <AppIcon.Security width={22} height={22} color={theme.colors.text.secondary} />,
          title: 'Registration Details',
          subtitle: 'Manage your registration details',
          type: 'navigation',
          onPress: handleNavigateToRegistrationDetails,
        },
        {
          id: 'wallet',
          icon: <AppIcon.Wallet width={22} height={22} color={theme.colors.text.secondary} />,
          title: 'Wallet',
          subtitle: 'Manage your wallet and credits',
          type: 'navigation',
          onPress: handleWalletPress,
        },
        {
          id: 'invoices',
          icon: <AppIcon.Transactions width={22} height={22} color={theme.colors.text.secondary} />,
          title: 'Invoices',
          subtitle: 'View and download payment invoices',
          type: 'navigation',
          onPress: handleInvoicesPress,
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
          icon: <AppIcon.Warning width={22} height={22} color={theme.colors.text.secondary} />,
          title: 'Help Center',
          type: 'navigation',
        },
        {
          id: 'contact',
          icon: <AppIcon.Mail width={22} height={22} color={theme.colors.text.secondary} />,
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
          icon: <AppIcon.ArrowRight width={22} height={22} color={theme.colors.error.DEFAULT} />,
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
          trackColor={{
            false: theme.colors.border.primary,
            true: theme.colors.primary[200],
          }}
          thumbColor={item.value ? theme.colors.primary.DEFAULT : theme.colors.text.tertiary}
        />
      )}
      {item.type === 'navigation' &&
        !('isSelected' in item && item.isSelected) && (
          <AppIcon.ChevronRight width={20} height={20} color={theme.colors.text.tertiary} />
        )}
      {'isSelected' in item && item.isSelected && (
        <AppIcon.TickCheckedBox width={20} height={20} color={theme.colors.primary.DEFAULT} />
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

      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        destructive
        loading={isLoggingOut}
        icon={<AppIcon.Warning width={32} height={32} color={theme.colors.error.DEFAULT} />}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </View>
  );
};

export default SettingsScreen;
