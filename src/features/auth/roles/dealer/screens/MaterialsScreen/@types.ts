import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';

export type MaterialsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Materials'
>;

// Selection tracking - we track by "materialId-gradeId" combo
export interface SelectedMaterial {
  materialId: number;
  materialName: string;
  gradeId: number;
  gradeName: string;
  category: string;
}

// For display purposes - grouped by category
export interface MaterialCategory {
  category: string;
  materials: {
    id: number;
    name: string;
    grades: {
      id: number;
      name: string;
    }[];
  }[];
}
