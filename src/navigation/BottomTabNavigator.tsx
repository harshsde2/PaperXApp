import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@store/hooks';
import { AppIcon } from '@assets/svgs';
import { Text } from '@shared/components/Text';
import { SCREENS, TAB_CONFIGS, UserRole } from './constants';

// Import Screens
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import MessagesScreen from '@features/main/screens/MessagesScreen/MessagesScreen';
import MarketScreen from '@features/main/screens/MarketScreen/MarketScreen';
import SettingsScreen from '@features/main/screens/SettingsScreen/SettingsScreen';
import InquiriesScreen from '@features/main/screens/InquiriesScreen/InquiriesScreen';
import CapacityScreen from '@features/main/screens/CapacityScreen/CapacityScreen';
import SessionsScreen from '@features/main/screens/SessionsScreen/SessionsScreen';

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
    [SCREENS.MAIN.SESSIONS]: SessionsScreen,
    [SCREENS.MAIN.PROFILE]: ProfileScreen,
  };
  return screens[screenName] || DashboardScreen;
};

// Custom Tab Bar Component
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((reduxState) => reduxState.auth);
  
  // Use primaryRole from Redux store - this is set during login
  const primaryRole = (user?.primaryRole || 'dealer').toLowerCase().replace(' ', '-') as UserRole;
  const tabConfig = TAB_CONFIGS[primaryRole] || TAB_CONFIGS.dealer;

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        // Find the tab config for this route
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
  const { user } = useAppSelector((state) => state.auth);
  
  // Use user's primaryRole from Redux store (already available after login)
  // The CustomTabBar will also check profile data for the most up-to-date role
  const primaryRole = (user?.primaryRole || 'dealer').toLowerCase().replace(' ', '-') as UserRole;
  const tabConfig = TAB_CONFIGS[primaryRole] || TAB_CONFIGS.dealer;
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
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconContainer: {
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
});

export default BottomTabNavigator;
