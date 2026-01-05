import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import React from 'react';
export type ScrapGenerationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ScrapGeneration'
>;

export interface ScrapOption {
  id: string;
  label: string;
}

export interface ScrapCategory {
  id: string;
  title: string;
  options: ScrapOption[];
  icon: any;
}

