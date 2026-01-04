import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import { CustomHeader } from '@shared/components/CustomHeader';
import { SCREENS } from './constants';

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.MAIN.DASHBOARD}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name={SCREENS.MAIN.DASHBOARD} 
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.PROFILE} 
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

