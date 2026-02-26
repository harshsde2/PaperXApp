import type { SelectedMaterial } from '../../@types';

export interface SelectedMaterialsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedMaterials: [string, SelectedMaterial][];
  onRemove: (key: string) => void;
}
