export interface SectionPillBarProps {
  sections: { id: string; title: string }[];
  activeId: string;
  onPress: (id: string) => void;
}
