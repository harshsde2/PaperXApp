import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';

export type MainStackParamList = {
  Dashboard: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

