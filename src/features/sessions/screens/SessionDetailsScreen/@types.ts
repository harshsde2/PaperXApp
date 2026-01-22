/**
 * SessionDetailsScreen Types
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SessionDetailsParams, MatchType } from '../../@types';

export type SessionDetailsScreenNavigationProp = NativeStackNavigationProp<any>;

export type SessionDetailsScreenRouteProp = RouteProp<
  { SessionDetails: SessionDetailsParams },
  'SessionDetails'
>;

export interface SessionDetailsScreenProps {
  navigation: SessionDetailsScreenNavigationProp;
  route: SessionDetailsScreenRouteProp;
}

export interface FilterChip {
  key: MatchType;
  label: string;
}
