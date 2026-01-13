import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import PostRequirementOptionsScreen from '@features/posting/screens/PostRequirementOptionsScreen';
import { CustomHeader } from '@shared/components/CustomHeader';
import { SCREENS } from './constants';

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Post: undefined;
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
    </Stack.Navigator>
  );
};

export default MainNavigator;
