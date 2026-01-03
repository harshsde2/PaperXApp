import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import { CustomHeader } from '@shared/components/CustomHeader';

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

