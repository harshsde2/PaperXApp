import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import { CustomHeader } from '@shared/components/CustomHeader';
import { DashboardHeader } from '@features/main/screens/DashboardScreen/components/DashboardHeader';
import { SCREENS } from './constants';
import { useNavigation } from '@react-navigation/native';
import { AppIcon } from '@assets/svgs';

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const navigation = useNavigation<any>();
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
          headerShown: true,
          header: () => <DashboardHeader />,
        }}
      />
      <Stack.Screen 
        name={SCREENS.MAIN.PROFILE} 
        options={{
          animation:'slide_from_right'          
        }}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

