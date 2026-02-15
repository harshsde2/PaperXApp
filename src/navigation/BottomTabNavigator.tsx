import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import type { RootState } from '@store/index';
import { setMessagesUnreadCount } from '@store/slices/uiSlice';
import { useActiveRole } from '@shared/hooks/useActiveRole';
import { AppIcon } from '@assets/svgs';
import { Text } from '@shared/components/Text';
import { useGetChatList } from '@services/api';
import type { ChatListItem } from '@services/api';
import { SCREENS, TAB_CONFIGS, UserRole } from './constants';

// Import Screens
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import MessagesScreen from '@features/main/screens/MessagesScreen/MessagesScreen';
import MarketScreen from '@features/main/screens/MarketScreen/MarketScreen';
import SettingsScreen from '@features/main/screens/SettingsScreen/SettingsScreen';
import InquiriesScreen from '@features/main/screens/InquiriesScreen/InquiriesScreen';
import CapacityScreen from '@features/main/screens/CapacityScreen/CapacityScreen';
import SessionDashboardScreen from '@features/sessions/screens/SessionDashboardScreen/SessionDashboardScreen';

export type BottomTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Messages: undefined;
  Market: undefined;
  Settings: undefined;
  Inquiries: undefined;
  Capacity: undefined;
  Sessions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Home: AppIcon.Home,
    Dashboard: AppIcon.Dashboard,
    Messages: AppIcon.Messages,
    Market: AppIcon.Market,
    Settings: AppIcon.Settings,
    Inquiries: AppIcon.Inquiries,
    Capacity: AppIcon.Capacity,
    Sessions: AppIcon.Sessions,
    Profile: AppIcon.Profile,
  };
  return icons[iconName] || AppIcon.Home;
};

// Get screen component by name
const getScreenComponent = (screenName: string) => {
  const screens: Record<string, React.ComponentType<any>> = {
    [SCREENS.MAIN.HOME]: DashboardScreen,
    [SCREENS.MAIN.DASHBOARD]: DashboardScreen,
    [SCREENS.MAIN.MESSAGES]: MessagesScreen,
    [SCREENS.MAIN.MARKET]: MarketScreen,
    [SCREENS.MAIN.SETTINGS]: SettingsScreen,
    [SCREENS.MAIN.INQUIRIES]: InquiriesScreen,
    [SCREENS.MAIN.CAPACITY]: CapacityScreen,
    [SCREENS.MAIN.SESSIONS]: SessionDashboardScreen,
    [SCREENS.MAIN.PROFILE]: ProfileScreen,
  };
  return screens[screenName] || DashboardScreen;
};

/** Format badge label: show number, cap at 99+ */
const getBadgeLabel = (count: number): string | null => {
  if (count <= 0) return null;
  return count > 99 ? '99+' : String(count);
};

// Custom Tab Bar Component
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const stackNavigation = useNavigation<any>();
  const messagesUnreadCount = useAppSelector((s: RootState) => s.ui.messagesUnreadCount);

  // Use activeRole from Redux (supports role switching)
  const activeRole = useActiveRole();
  const tabConfig = TAB_CONFIGS[activeRole] || TAB_CONFIGS.dealer;

  const handlePostPress = () => {
    stackNavigation.navigate(SCREENS.MAIN.POST);
  };

  // Split tabs into left and right sides for Post button in center
  const totalTabs = state.routes.length;
  const middleIndex = Math.floor(totalTabs / 2);
  const leftTabs = state.routes.slice(0, middleIndex);
  const rightTabs = state.routes.slice(middleIndex);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom || 12 }]}>
      {/* Left side tabs */}
      {leftTabs.map((route) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
        
        const config = tabConfig.find(t => t.name === route.name);
        if (!config) return null;

        const IconComponent = getIconComponent(config.icon);
        const label = config.label;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const badgeLabel = route.name === 'Messages' ? getBadgeLabel(messagesUnreadCount) : null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <IconComponent
                width={24}
                height={24}
                color={isFocused ? '#2563EB' : '#9CA3AF'}
              />
              {badgeLabel !== null && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText} numberOfLines={1}>
                    {badgeLabel}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? '#2563EB' : '#6B7280' },
              ]}
            >
              {label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}

      {/* Post Button in the center */}
      <TouchableOpacity
        style={styles.postButton}
        onPress={handlePostPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Post Requirement"
      >
        <View style={styles.postButtonInner}>
          <Text style={styles.postButtonText}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Right side tabs */}
      {rightTabs.map((route) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
        
        const config = tabConfig.find(t => t.name === route.name);
        if (!config) return null;

        const IconComponent = getIconComponent(config.icon);
        const label = config.label;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const badgeLabel = route.name === 'Messages' ? getBadgeLabel(messagesUnreadCount) : null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <IconComponent
                width={24}
                height={24}
                color={isFocused ? '#2563EB' : '#9CA3AF'}
              />
              {badgeLabel !== null && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText} numberOfLines={1}>
                    {badgeLabel}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? '#2563EB' : '#6B7280' },
              ]}
            >
              {label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: chatList = [] } = useGetChatList();
  const list = chatList as ChatListItem[];
  const totalUnread = useMemo(
    () => list.reduce((sum, item) => sum + (item.unread_count ?? 0), 0),
    [list]
  );
  const badgeCount = useMemo(
    () => (totalUnread > 0 ? totalUnread : list.length),
    [totalUnread, list.length]
  );
  useEffect(() => {
    dispatch(setMessagesUnreadCount(badgeCount));
  }, [dispatch, badgeCount]);

  // Use activeRole from Redux (supports role switching)
  const activeRole = useActiveRole();
  const tabConfig = TAB_CONFIGS[activeRole] || TAB_CONFIGS.dealer;
  const initialRouteName = tabConfig[0]?.name || SCREENS.MAIN.DASHBOARD;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName as keyof BottomTabParamList}
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof BottomTabParamList}
          component={getScreenComponent(tab.name)}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#EEF2FF',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 24,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  postButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: -24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  postButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 36,
    marginTop: -2,
  },
});

export default BottomTabNavigator;
