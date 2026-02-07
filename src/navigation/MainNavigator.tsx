import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import PostRequirementOptionsScreen from '@features/posting/screens/PostRequirementOptionsScreen';
import PostToBuyScreen from '@features/posting/screens/PostToBuyScreen/PostToBuyScreen';
import PostToSellMachineScreen from '@features/posting/screens/PostToSellMachineScreen/PostToSellMachineScreen';
import PostToBuyMachineScreen from '@features/posting/screens/PostToBuyMachineScreen/PostToBuyMachineScreen';
import PostBrandRequirementScreen from '@features/posting/screens/PostBrandRequirementScreen/PostBrandRequirementScreen';
import RequirementsListScreen from '@features/posting/screens/RequirementsListScreen/RequirementsListScreen';
import PaymentConfirmationScreen from '@features/posting/screens/PaymentConfirmationScreen/PaymentConfirmationScreen';
import MatchmakingSuccessScreen from '@features/posting/screens/MatchmakingSuccessScreen/MatchmakingSuccessScreen';
import {
  WalletScreen,
  CreditPacksScreen,
  TransactionHistoryScreen,
} from '@features/wallet';
import {
  SessionDashboardScreen,
  SessionDetailsScreen,
  ResponderDetailsScreen,
  SessionLockedScreen,
  SessionChatScreen,
} from '@features/sessions';
import { CustomHeader } from '@shared/components/CustomHeader';
import { SCREENS } from './constants';

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Post: undefined;
  PostToBuy: { intent?: 'buy' | 'sell' } | undefined;
  PostBrandRequirement: undefined;
  Requirements: undefined;
  PaymentConfirmation: {
    listingDetails: {
      id?: string;
      title: string;
      referenceNumber: string;
      grade: string;
      materialName: string;
      quantity: string;
      quantityUnit: string;
      urgency: string;
      imageUrl?: string;
      tags: string[];
    };
    formData: any;
    requirementType?: 'dealer' | 'brand' | 'converter' | 'machineDealer';
  };
  PostToSellMachine: undefined;
  PostToBuyMachine: undefined;
  MatchmakingSuccess: {
    requirementDetails: {
      id: string;
      materialName: string;
      quantity: string;
      deadline: string;
      imageUrl?: string;
    };
    creditsDeducted: number;
  };
  // Wallet Screens
  WalletMain: undefined;
  CreditPacks: undefined;
  TransactionHistory: undefined;
  AddCustomCredits: undefined;
  // Session Screens
  SessionDashboard: {
    initialTab?: 'all' | 'finding_matches' | 'active' | 'locked';
  };
  SessionDetails: {
    sessionId: string;
    session?: any;
  };
  ResponderDetails: {
    sessionId: string;
    session?: any;
  };
  SessionLocked: {
    sessionId: string;
    session?: any;
  };
  SessionChat: {
    sessionId: string;
    partnerId: string;
    partnerName: string;
    inquiryRef?: string;
  };
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
        name={SCREENS.MAIN.POST_TO_SELL_MACHINE} 
        component={PostToSellMachineScreen}
        options={{
          headerShown: true,
          title: 'Post to Sell Machine',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.POST_TO_BUY_MACHINE} 
        component={PostToBuyMachineScreen}
        options={{
          headerShown: true,
          title: 'Post to Buy Machine',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.POST_BRAND_REQUIREMENT} 
        component={PostBrandRequirementScreen}
        options={{
          headerShown: true,
          title: 'Post Requirement',
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
      <Stack.Screen 
        name={SCREENS.MAIN.PAYMENT_CONFIRMATION} 
        component={PaymentConfirmationScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.MATCHMAKING_SUCCESS} 
        component={MatchmakingSuccessScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          gestureEnabled: false,
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
      {/* Session Screens */}
      <Stack.Screen 
        name={SCREENS.SESSIONS.DASHBOARD} 
        component={SessionDashboardScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.SESSIONS.DETAILS} 
        component={SessionDetailsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.SESSIONS.RESPONDER_DETAILS} 
        component={ResponderDetailsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.SESSIONS.LOCKED} 
        component={SessionLockedScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name={SCREENS.SESSIONS.CHAT} 
        component={SessionChatScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
