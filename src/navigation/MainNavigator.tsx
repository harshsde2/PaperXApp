import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '@features/main/screens/DashboardScreen/DashboardScreen';
import ProfileScreen from '@features/main/screens/ProfileScreen/ProfileScreen';
import { CustomHeader } from '@shared/components/CustomHeader';
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
          header: (props) => <CustomHeader {...props}  title="Dashboard" leftButtonStyle={{ display: 'none' }}  titleContainerStyle={{ alignItems: 'flex-start',flex: 1, }} titleStyle={{ fontSize: 24, fontWeight: 'bold', color: '#000000' }} rightButton={{ icon: <AppIcon.PersonIcon width={30} height={30} />, onPress: () => navigation.navigate(SCREENS.MAIN.PROFILE) }} />,
          headerTitle: 'Dashboard',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000000',
          },
          headerBackTitle: '',
          headerBackTitleStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000000',
          },
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

