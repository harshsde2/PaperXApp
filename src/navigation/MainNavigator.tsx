import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import PostRequirementOptionsScreen from '@features/posting/screens/PostRequirementOptionsScreen';
import PostToBuyScreen from '@features/posting/screens/PostToBuyScreen/PostToBuyScreen';
import RequirementsListScreen from '@features/posting/screens/RequirementsListScreen/RequirementsListScreen';
import {
  WalletScreen,
  CreditPacksScreen,
  TransactionHistoryScreen,
} from '@features/wallet';
import { CustomHeader } from '@shared/components/CustomHeader';
import { SCREENS } from './constants';

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Post: undefined;
  PostToBuy: undefined;
  Requirements: undefined;
  // Wallet Screens
  WalletMain: undefined;
  CreditPacks: undefined;
  TransactionHistory: undefined;
  AddCustomCredits: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.MAIN.TABS}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name={SCREENS.MAIN.TABS} 
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.PROFILE} 
        component={ProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.POST} 
        component={PostRequirementOptionsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.POST_TO_BUY} 
        component={PostToBuyScreen}
        options={{
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.REQUIREMENTS} 
        component={RequirementsListScreen}
        options={{
          headerShown: true,
          title: 'My Requirements',
          animation: 'slide_from_right',
        }}
      />
      {/* Wallet Screens */}
      <Stack.Screen 
        name={SCREENS.WALLET.MAIN} 
        component={WalletScreen}
        options={{
          headerShown: true,
          title: 'Wallet',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.WALLET.CREDIT_PACKS} 
        component={CreditPacksScreen}
        options={{
          headerShown: true,
          title: 'Buy Credits',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.WALLET.TRANSACTION_HISTORY} 
        component={TransactionHistoryScreen}
        options={{
          headerShown: true,
          title: 'Transaction History',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
