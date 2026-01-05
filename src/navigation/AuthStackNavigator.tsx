import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREENS } from './constants';
import SplashScreen from '@features/auth/screens/SplashScreen/SplashScreen';
import LoginScreen from '@features/auth/screens/LoginScreen/LoginScreen';
import SignupScreen from '@features/auth/screens/SignupScreen/SignupScreen';
import OTPVerificationScreen from '@features/auth/screens/OTPVerificationScreen/OTPVerificationScreen';
import CompanyDetailsScreen from '@features/auth/registration/screens/CompanyDetailsScreen/CompanyDetailsScreen';
import RoleSelectionScreen from '@features/auth/registration/screens/RoleSelectionScreen/RoleSelectionScreen';
import VerificationStatusScreen from '@features/auth/registration/screens/VerificationStatusScreen/VerificationStatusScreen';
import MaterialsScreen from '@features/auth/roles/dealer/screens/MaterialsScreen/MaterialsScreen';
import MillBrandDetailsScreen from '@features/auth/roles/dealer/screens/MillBrandDetailsScreen/MillBrandDetailsScreen';
import MaterialSpecsScreen from '@features/auth/roles/dealer/screens/MaterialSpecsScreen/MaterialSpecsScreen';
import SelectThicknessScreen from '@features/auth/roles/dealer/screens/SelectThicknessScreen/SelectThicknessScreen';
import ManageWarehousesScreen from '@features/auth/roles/dealer/screens/ManageWarehousesScreen/ManageWarehousesScreen';
import ConverterTypeScreen from '@features/auth/roles/converter/screens/ConverterTypeScreen/ConverterTypeScreen';
import FinishedProductsScreen from '@features/auth/roles/converter/screens/FinishedProductsScreen/FinishedProductsScreen';
import MachineryScreen from '@features/auth/roles/converter/screens/MachineryScreen/MachineryScreen';
import ScrapGenerationScreen from '@features/auth/roles/converter/screens/ScrapGenerationScreen/ScrapGenerationScreen';
import ProductionCapacityScreen from '@features/auth/roles/converter/screens/ProductionCapacityScreen/ProductionCapacityScreen';
import RawMaterialsScreen from '@features/auth/roles/converter/screens/RawMaterialsScreen/RawMaterialsScreen';
import FactoryLocationScreen from '@features/auth/roles/converter/screens/FactoryLocationScreen/FactoryLocationScreen';
import ConfirmRegistrationScreen from '@features/auth/roles/converter/screens/ConfirmRegistrationScreen/ConfirmRegistrationScreen';
import { CustomHeader } from '@shared/components/CustomHeader';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  OTPVerification: { mobile: string; purpose: 'login' | 'signup' };
  CompanyDetails: undefined;
  RoleSelection: undefined;
  VerificationStatus: undefined;
  Materials: undefined;
  MillBrandDetails: undefined;
  MaterialSpecs: undefined;
  SelectThickness: undefined;
  ManageWarehouses: undefined;
  ConverterType: undefined;
  FinishedProducts: undefined;
  Machinery: undefined;
  ScrapGeneration: undefined;
  ProductionCapacity: undefined;
  RawMaterials: undefined;
  FactoryLocation: undefined;
  ConfirmRegistration: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.AUTH.SPLASH}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name={SCREENS.AUTH.SPLASH} options={{ headerShown: false }} component={SplashScreen} />
      <Stack.Screen name={SCREENS.AUTH.LOGIN} options={{ headerShown: false }} component={LoginScreen} />
      <Stack.Screen name={SCREENS.AUTH.SIGNUP} component={SignupScreen} />
      <Stack.Screen
        name={SCREENS.AUTH.OTP_VERIFICATION}
        component={OTPVerificationScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.COMPANY_DETAILS}
        component={CompanyDetailsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.ROLE_SELECTION}
        component={RoleSelectionScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.VERIFICATION_STATUS}
        component={VerificationStatusScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.MATERIALS}
        component={MaterialsScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.MILL_BRAND_DETAILS}
        component={MillBrandDetailsScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.MATERIAL_SPECS}
        component={MaterialSpecsScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.SELECT_THICKNESS}
        component={SelectThicknessScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.MANAGE_WAREHOUSES}
        component={ManageWarehousesScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.CONVERTER_TYPE}
        component={ConverterTypeScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.FINISHED_PRODUCTS}
        component={FinishedProductsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.MACHINERY}
        component={MachineryScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.SCRAP_GENERATION}
        component={ScrapGenerationScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.PRODUCTION_CAPACITY}
        component={ProductionCapacityScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.RAW_MATERIALS}
        component={RawMaterialsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.FACTORY_LOCATION}
        component={FactoryLocationScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={SCREENS.AUTH.CONFIRM_REGISTRATION}
        component={ConfirmRegistrationScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;

