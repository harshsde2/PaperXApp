/**
 * MatchmakingSuccessScreen Types
 */

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface RequirementDetails {
  id: string;
  materialName: string;
  quantity: string;
  deadline: string;
  imageUrl?: string;
}

export interface MatchmakingSuccessRouteParams {
  requirementDetails: RequirementDetails;
  creditsDeducted: number;
}

export type MatchmakingSuccessScreenNavigationProp = NativeStackNavigationProp<any>;

export type MatchmakingSuccessScreenRouteProp = RouteProp<
  { MatchmakingSuccess: MatchmakingSuccessRouteParams },
  'MatchmakingSuccess'
>;

export interface MatchmakingSuccessScreenProps {
  navigation: MatchmakingSuccessScreenNavigationProp;
  route: MatchmakingSuccessScreenRouteProp;
}
