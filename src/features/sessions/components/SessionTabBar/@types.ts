/**
 * SessionTabBar Types
 */

import { SessionTabType } from '../../@types';

export interface TabItem {
  key: SessionTabType;
  label: string;
}

export interface SessionTabBarProps {
  activeTab: SessionTabType;
  onTabChange: (tab: SessionTabType) => void;
  tabs?: TabItem[];
}
