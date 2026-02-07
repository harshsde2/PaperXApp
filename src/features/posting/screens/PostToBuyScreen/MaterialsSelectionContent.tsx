import React, { memo, useMemo, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, ListRenderItem, TouchableOpacity } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { Theme } from '@theme/types';
import { Material } from '@services/api';
import { MaterialItem } from './PostToBuyScreen';
import { createStyles } from './materialsSelectionStyles';

const END_REACHED_THRESHOLD = 0.2;

export interface GradeListItem {
  type: 'grade';
  id: string;
  data: {
    materialId: number;
    materialName: string;
    gradeId: number;
    gradeName: string;
    category: string;
  };
}

interface GradeItemProps {
  materialId: number;
  gradeId: number;
  gradeName: string;
  materialName: string;
  onToggle: (materialId: number, gradeId: number, materialName?: string, gradeName?: string) => void;
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
}

const GradeItem = memo(
  ({ materialId, gradeId, gradeName, materialName, onToggle, styles, theme }: GradeItemProps) => {
    const handlePress = useCallback(() => {
      onToggle(materialId, gradeId, materialName, gradeName);
    }, [materialId, gradeId, materialName, gradeName, onToggle]);

    return (
      <TouchableOpacity
        style={[styles.materialItem, { paddingLeft: theme.spacing[4] }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.materialItemContent}>
          <Text variant="bodyMedium" style={styles.materialItemName}>
            {gradeName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
GradeItem.displayName = 'GradeItem';

// Props when mode is 'material' (legacy, unused now from PostToBuy)
interface MaterialModeProps {
  mode: 'material';
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedMaterialIds: Set<number> | number[];
  materials: Material[];
  filteredMaterials: Material[];
  onToggle: (materialId: number) => void;
}

// Props when mode is 'grade' (one row per grade)
interface GradeModeProps {
  mode: 'grade';
  searchQuery: string;
  onSearchChange: (text: string) => void;
  gradeList: GradeListItem[];
  selectedMaterialId: number | null;
  selectedGradeId: number | null;
  onToggleGrade: (materialId: number, gradeId: number, materialName?: string, gradeName?: string) => void;
}

interface MaterialsSelectionContentCommonProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onClear?: () => void;
  onLoadMore: () => void;
  onScroll: (event: any) => void;
  theme: Theme;
}

type MaterialsSelectionContentProps = MaterialsSelectionContentCommonProps & (MaterialModeProps | GradeModeProps);

export const MaterialsSelectionContent = memo((props: MaterialsSelectionContentProps) => {
  const {
    searchQuery,
    onSearchChange,
    isLoading,
    isFetchingNextPage,
    onClear,
    onLoadMore,
    onScroll,
    theme,
  } = props;

  const styles = createStyles(theme);
  const scrollViewRef = useRef<FlatList>(null);

  const isGradeMode = props.mode === 'grade';

  const selectedCount = isGradeMode
    ? (props.selectedMaterialId != null && props.selectedGradeId != null ? 1 : 0)
    : (Array.isArray(props.selectedMaterialIds)
        ? props.selectedMaterialIds.length
        : props.selectedMaterialIds.size);

  const renderGradeItem: ListRenderItem<GradeListItem> = useCallback(
    ({ item }) => {
      const { materialId, gradeId, gradeName, materialName } = item.data;
      return (
        <GradeItem
          materialId={materialId}
          gradeId={gradeId}
          gradeName={gradeName}
          materialName={materialName}
          onToggle={props.mode === 'grade' ? props.onToggleGrade : () => {}}
          styles={styles}
          theme={theme}
        />
      );
    },
    [props.mode === 'grade' ? props.onToggleGrade : null, styles, theme],
  );

  const selectedIdsSet = useMemo(() => {
    if (isGradeMode || props.mode !== 'material') return new Set<number>();
    const ids = props.selectedMaterialIds;
    return Array.isArray(ids) ? new Set(ids) : ids;
  }, [isGradeMode, props.mode === 'material' ? props.selectedMaterialIds : null]);

  const isMaterialSelected = useCallback(
    (materialId: number) => selectedIdsSet.has(materialId),
    [selectedIdsSet],
  );

  const renderMaterialItem: ListRenderItem<Material> = useCallback(
    ({ item }) => {
      const isSelected = isMaterialSelected(item.id);
      return (
        <MaterialItem
          material={item}
          isSelected={isSelected}
          onToggle={props.mode === 'material' ? props.onToggle : () => {}}
          styles={styles}
          theme={theme}
        />
      );
    },
    [isMaterialSelected, props.mode === 'material' ? props.onToggle : null, styles, theme],
  );

  const listData = isGradeMode
    ? props.gradeList
    : (props.mode === 'material' ? props.filteredMaterials : []);
  const keyExtractor = useCallback(
    (item: GradeListItem | Material) =>
      isGradeMode ? (item as GradeListItem).id : `material-${(item as Material).id}`,
    [isGradeMode],
  );
  const renderItem = isGradeMode ? renderGradeItem : renderMaterialItem;

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View
          style={{ paddingVertical: theme.spacing[4], alignItems: 'center' }}
        >
          <ActivityIndicator
            size="small"
            color={theme.colors.primary.DEFAULT}
          />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, theme]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="h4" fontWeight="semibold" style={styles.title}>
          {isGradeMode ? 'Select Grade' : 'Select Material'}
        </Text>
        {!isGradeMode && selectedCount > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" style={styles.clearButtonText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!isGradeMode && selectedCount > 0 && (
        <View style={styles.selectedCountContainer}>
          <Text variant="bodySmall" style={styles.selectedCountText}>
            1 material selected
          </Text>
        </View>
      )}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <AppIcon.Search
            width={18}
            height={18}
            color={theme.colors.text.tertiary}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder={isGradeMode ? 'Search grades' : 'Search materials'}
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      ) : (
        <FlatList
          ref={scrollViewRef}
          data={listData}
          renderItem={renderItem as ListRenderItem<GradeListItem | Material>}
          keyExtractor={keyExtractor as (item: GradeListItem | Material) => string}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={styles.listContent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onScroll={onScroll}
          scrollEnabled={true}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          updateCellsBatchingPeriod={50}
          getItemLayout={
            listData.length
              ? (_: any, index: number) => ({
                  length: 60,
                  offset: 60 * index,
                  index,
                })
              : undefined
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery
                  ? (isGradeMode ? 'No grades found' : 'No materials found')
                  : (isGradeMode ? 'No grades available' : 'No materials available')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
});

MaterialsSelectionContent.displayName = 'MaterialsSelectionContent';
