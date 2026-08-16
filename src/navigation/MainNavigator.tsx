import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import PostRequirementOptionsScreen from '@features/posting/screens/PostRequirementOptionsScreen';
import PostToBuyScreen from '@features/posting/screens/PostToBuyScreen/PostToBuyScreen';
import PostToSellMachineScreen from '@features/posting/screens/PostToSellMachineScreen/PostToSellMachineScreen';
import PostToBuyMachineScreen from '@features/posting/screens/PostToBuyMachineScreen/PostToBuyMachineScreen';
import PostBrandRequirementScreen from '@features/posting/screens/PostBrandRequirementScreen/PostBrandRequirementScreen';
import PostJobworkFindScreen from '@features/posting/screens/PostJobworkFindScreen/PostJobworkFindScreen';
import PostJobworkGiveScreen from '@features/posting/screens/PostJobworkGiveScreen/PostJobworkGiveScreen';
import RequirementsListScreen from '@features/posting/screens/RequirementsListScreen/RequirementsListScreen';
import PaymentConfirmationScreen from '@features/posting/screens/PaymentConfirmationScreen/PaymentConfirmationScreen';
import MatchmakingSuccessScreen from '@features/posting/screens/MatchmakingSuccessScreen/MatchmakingSuccessScreen';
import {
  WalletScreen,
  CreditPacksScreen,
  TransactionHistoryScreen,
  InvoiceListScreen,
  InvoiceDetailScreen,
} from '@features/wallet';
import {
  SessionDashboardScreen,
  SessionDetailsScreen,
  ResponderDetailsScreen,
  SessionLockedScreen,
  SessionChatScreen,
  InquiryChatThreadsScreen,
  StructuredChatScreen,
} from '@features/sessions';
import {
  ConverterRTDListingScreen,
  ConverterRTDListingPackScreen,
  ConverterRTDAddProductScreen,
  ConverterRTDMyProductsScreen,
  RTDOrderHistoryScreen,
  RTDOrderDetailScreen,
} from '@features/converter/rtd';
import {
  BrandRTDMarketplaceScreen,
  BrandRTDProductDetailScreen,
  BrandRTDRequestOrderScreen,
  BrandRTDOrderDetailScreen,
  BrandRTDMyOrdersScreen,
} from '@features/brand/rtd';
import { CustomHeader } from '@shared/components/CustomHeader';
import { SCREENS } from './constants';
import MarketScreen from '@features/main/screens/MarketScreen/MarketScreen';
import NotificationsScreen from '@features/main/screens/NotificationsScreen/NotificationsScreen';
import MessagesScreen from '@features/main/screens/MessagesScreen/MessagesScreen';
import ResponsesListScreen from '@features/sessions/screens/ResponsesListScreen';
import RegistrationDetailsScreen from '@features/main/screens/RegistrationDetailsScreen/RegistrationDetailsScreen';
import EditRegistrationSectionScreen from '@features/main/screens/EditRegistrationSectionScreen';
import ArticleDetailScreen from '@features/main/screens/MarketScreen/components/ArticleDetailScreen';
import type { MarketInsightArticle } from '@services/api';

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Post: undefined;
  PostToBuy: { intent?: 'buy' | 'sell' } | undefined;
  PostBrandRequirement: undefined;
  Requirements: undefined;
  MarketScreen: undefined;
  ArticleDetail: { article: MarketInsightArticle };
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
    requirementType?:
      | 'dealer'
      | 'brand'
      | 'converter'
      | 'machineDealer'
      | 'converter-jobwork-find'
      | 'converter-jobwork-give';
  };
  PostToSellMachine: undefined;
  PostToBuyMachine: undefined;
  PostJobworkFind: undefined;
  PostJobworkGive: undefined;
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
  Notifications: undefined;
  Messages: undefined;
  Responses: undefined;
  RegistrationDetails: undefined;
  EditRegistrationSection: {
    role: string;
    editKey: string;
    title: string;
    edit: Record<string, any>;
  };
  // Wallet Screens
  WalletMain: undefined;
  /** Optional return target after Razorpay credit purchase (e.g. RTD add product). */
  CreditPacks:
    | {
        returnTo?: {
          name: keyof MainStackParamList;
          params?: object;
        };
      }
    | undefined;
  TransactionHistory: undefined;
  AddCustomCredits: undefined;
  InvoiceList: undefined;
  InvoiceDetail: { invoiceKey: string; invoiceNo?: string };
  // Session Screens
  SessionDashboard: {
    initialTab?: 'all' | 'my_posts';
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
  InquiryChatThreads: {
    inquiryId: string;
    inquiryTitle?: string;
  };
  StructuredChat: {
    threadId: string;
    inquiryId?: string;
    partnerName?: string;
  };
  // Converter RTD
  ConverterRTDListing: undefined;
  ConverterRTDListingPack: undefined;
  ConverterRTDAddProduct: { productId?: number } | undefined;
  ConverterRTDMyProducts: undefined;
  ConverterRTDOrderHistory: undefined;
  ConverterRTDOrderDetail: { orderId: number | string };
  // Brand RTD
  BrandRTDMarketplace: undefined;
  BrandRTDProductDetail: { productId: number };
  BrandRTDRequestOrder: { productId: number; quantity?: number };
  BrandRTDOrderDetail: { orderId: number | string };
  BrandRTDMyOrders: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.MAIN.TABS}
      screenOptions={{
        header: (props) => (
          <CustomHeader
            {...props}
            title={(props as any).scene?.descriptor?.options?.title}
          />
        ),
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name={SCREENS.MAIN.TABS}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.PROFILE}
        component={ProfileScreen}
        options={{
          headerShown: true,
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
        name={SCREENS.MAIN.MARKET_INSIGHT}
        component={MarketScreen}
        options={{
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.ARTICLE_DETAIL}
        component={ArticleDetailScreen}
        options={{
          headerShown: false,
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
        name={SCREENS.MAIN.POST_JOBWORK_FIND}
        component={PostJobworkFindScreen}
        options={{
          headerShown: true,
          title: 'Post to Find Jobwork',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.POST_JOBWORK_GIVE}
        component={PostJobworkGiveScreen}
        options={{
          headerShown: true,
          title: 'Post to Give Jobwork',
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
          gestureEnabled: false,
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
      <Stack.Screen
        name={SCREENS.MAIN.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.MESSAGES}
        component={MessagesScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.RESPONSES}
        component={ResponsesListScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.REGISTRATION_DETAILS}
        component={RegistrationDetailsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.MAIN.EDIT_REGISTRATION_SECTION}
        component={EditRegistrationSectionScreen}
        options={{
          headerShown: false,
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
      <Stack.Screen
        name={SCREENS.INVOICES.LIST}
        component={InvoiceListScreen}
        options={{
          headerShown: true,
          title: 'Invoices',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.INVOICES.DETAIL}
        component={InvoiceDetailScreen}
        options={({ route }) => ({
          headerShown: true,
          title: (route.params as { invoiceNo?: string })?.invoiceNo || 'Invoice',
          animation: 'slide_from_right',
        })}
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
      <Stack.Screen
        name={SCREENS.SESSIONS.INQUIRY_CHAT_THREADS}
        component={InquiryChatThreadsScreen}
        options={{
          headerShown: true,
          title: 'Responder Chats',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.SESSIONS.STRUCTURED_CHAT}
        component={StructuredChatScreen}
        options={({ route }) => ({
          headerShown: true,
          title: (route.params as { partnerName?: string } | undefined)?.partnerName || 'Chat',
          animation: 'slide_from_right',
        })}
      />
      {/* Converter RTD (Ready-to-Dispatch) - converter only */}
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.LISTING}
        component={ConverterRTDListingScreen}
        options={{
          headerShown: true,
          title: 'Ready-to-Dispatch',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.LISTING_PACK}
        component={ConverterRTDListingPackScreen}
        options={{
          headerShown: true,
          title: 'Listing pack',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.ADD_PRODUCT}
        component={ConverterRTDAddProductScreen}
        options={{
          headerShown: true,
          title: 'Add Ready Product',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.MY_PRODUCTS}
        component={ConverterRTDMyProductsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.ORDER_HISTORY}
        component={RTDOrderHistoryScreen}
        options={{
          headerShown: true,
          title: 'Order History',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.CONVERTER_RTD.ORDER_DETAIL}
        component={RTDOrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Order Details',
          animation: 'slide_from_right',
        }}
      />
      {/* Brand RTD (Ready-to-Dispatch) - brand browsing & ordering */}
      <Stack.Screen
        name={SCREENS.BRAND_RTD.MARKETPLACE}
        component={BrandRTDMarketplaceScreen}
        options={{
          headerShown: true,
          title: 'Ready to Dispatch Products',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.BRAND_RTD.PRODUCT_DETAIL}
        component={BrandRTDProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Product Details',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.BRAND_RTD.REQUEST_ORDER}
        component={BrandRTDRequestOrderScreen}
        options={{
          headerShown: true,
          title: 'Request Order',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.BRAND_RTD.ORDER_DETAIL}
        component={BrandRTDOrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Order Status',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name={SCREENS.BRAND_RTD.MY_ORDERS}
        component={BrandRTDMyOrdersScreen}
        options={{
          headerShown: true,
          title: 'My Ready to Dispatch Orders',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
