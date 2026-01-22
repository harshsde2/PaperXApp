/**
 * SessionChatScreen Types
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SessionChatParams } from '../../@types';

export type SessionChatScreenNavigationProp = NativeStackNavigationProp<any>;

export type SessionChatScreenRouteProp = RouteProp<
  { SessionChat: SessionChatParams },
  'SessionChat'
>;

export interface SessionChatScreenProps {
  navigation: SessionChatScreenNavigationProp;
  route: SessionChatScreenRouteProp;
}
