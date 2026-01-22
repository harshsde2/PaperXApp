/**
 * SessionLockedScreen Types
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SessionLockedParams } from '../../@types';

export type SessionLockedScreenNavigationProp = NativeStackNavigationProp<any>;

export type SessionLockedScreenRouteProp = RouteProp<
  { SessionLocked: SessionLockedParams },
  'SessionLocked'
>;

export interface SessionLockedScreenProps {
  navigation: SessionLockedScreenNavigationProp;
  route: SessionLockedScreenRouteProp;
}
