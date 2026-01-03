import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigator';

const AppNavigator = () => {
  // TODO: Add authentication check to switch between Auth and Main navigators
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return (
    <NavigationContainer>
      <AuthStackNavigator />
      {/* TODO: Add MainTabNavigator when authenticated */}
      {/* {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />} */}
    </NavigationContainer>
  );
};

export default AppNavigator;

