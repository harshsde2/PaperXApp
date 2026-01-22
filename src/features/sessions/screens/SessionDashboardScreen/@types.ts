/**
 * SessionDashboardScreen Types
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SessionTabType, SessionDashboardParams } from '../../@types';

export type SessionDashboardScreenNavigationProp = NativeStackNavigationProp<any>;

export type SessionDashboardScreenRouteProp = RouteProp<
  { SessionDashboard: SessionDashboardParams },
  'SessionDashboard'
>;

export interface SessionDashboardScreenProps {
  navigation: SessionDashboardScreenNavigationProp;
  route: SessionDashboardScreenRouteProp;
}
