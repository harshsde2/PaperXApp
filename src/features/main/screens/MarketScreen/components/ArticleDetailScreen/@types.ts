import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '@navigation/MainNavigator';

export type ArticleDetailScreenProps = StackScreenProps<
  MainStackParamList,
  'ArticleDetail'
>;
