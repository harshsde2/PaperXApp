import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { AppIcon } from '@assets/svgs';
import { useTheme, Theme } from '@theme/index';
import { SCREENS } from '@navigation/constants';
import { MaterialsScreenNavigationProp, SelectedMaterial } from './@types';
import { createStyles } from './styles';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useGetMaterialsInfinite, Material, MaterialGrade } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Constants for optimization
const ITEMS_PER_PAGE = 50;
const ESTIMATED_ITEM_HEIGHT = 56;

// Types for flattened list
interface FlatListItem {
  type: 'category' | 'material' | 'grade';
  id: string;
  data: {
    category?: string;
    materialId?: number;
    materialName?: string;
    gradeId?: number;
    gradeName?: string;
  };
}

// Memoized Grade Item Component
interface GradeItemProps {
  materialId: number;
  materialName: string;
  gradeId: number;
  gradeName: string;
  category: string;
  isSelected: boolean;
  onToggle: (
    materialId: number,
    materialName: string,
    gradeId: number,
    gradeName: string,
    category: string
  ) => void;
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
}

const GradeItem = memo(
  ({
    materialId,
    materialName,
    gradeId,
    gradeName,
    category,
    isSelected,
    onToggle,
    styles,
    theme,
  }: GradeItemProps) => {
    const handlePress = useCallback(() => {
      onToggle(materialId, materialName, gradeId, gradeName, category);
    }, [materialId, materialName, gradeId, gradeName, category, onToggle]);

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
        {isSelected ? (
          <AppIcon.TickCheckedBox
            width={24}
            height={24}
            color={theme.colors.primary.DEFAULT}
          />
        ) : (
          <AppIcon.UntickCheckedBox
            width={24}
            height={24}
            color={theme.colors.text.primary}
          />
        )}
      </TouchableOpacity>
    );
  }
);

GradeItem.displayName = 'GradeItem';

// Memoized Chip Component
interface SelectionChipProps {
  selectionKey: string;
  materialName: string;
  gradeName: string;
  onRemove: (key: string) => void;
  styles: ReturnType<typeof createStyles>;
}

const SelectionChip = memo(
  ({ selectionKey, materialName, gradeName, onRemove, styles }: SelectionChipProps) => {
    const handlePress = useCallback(() => {
      onRemove(selectionKey);
    }, [selectionKey, onRemove]);

    return (
      <TouchableOpacity
        style={styles.chip}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text variant="bodySmall" fontWeight="medium" style={styles.chipText}>
          {materialName} - {gradeName}
        </Text>
        <Text style={styles.chipText}>×</Text>
      </TouchableOpacity>
    );
  }
);

SelectionChip.displayName = 'SelectionChip';

const MaterialsScreen = () => {
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Materials'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  // Get profileData from route params (passed from RoleSelectionScreen)
  const { profileData } = route.params || {};

  // Fetch materials with infinite pagination
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMaterialsInfinite(ITEMS_PER_PAGE);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Optimized selection using Set for O(1) lookups
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState<Map<string, SelectedMaterial>>(
    new Map()
  );

  // Flatten all pages into a single materials array
  const allMaterials = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.materials);
  }, [data?.pages]);

  // Generate selection key
  const getSelectionKey = useCallback(
    (materialId: number, gradeId: number) => `${materialId}-${gradeId}`,
    []
  );

  // Check if grade is selected - O(1) lookup
  const isGradeSelected = useCallback(
    (materialId: number, gradeId: number) =>
      selectedKeys.has(getSelectionKey(materialId, gradeId)),
    [selectedKeys, getSelectionKey]
  );

  // Handle grade toggle - optimized with Set
  const handleGradeToggle = useCallback(
    (
    materialId: number,
    materialName: string,
    gradeId: number,
    gradeName: string,
    category: string
  ) => {
    const key = getSelectionKey(materialId, gradeId);

      setSelectedKeys(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });

      setSelectedMaterials(prev => {
        const newMap = new Map(prev);
        if (newMap.has(key)) {
          newMap.delete(key);
    } else {
          newMap.set(key, {
        materialId,
        materialName,
        gradeId,
        gradeName,
        category,
      });
    }
        return newMap;
      });
    },
    [getSelectionKey]
  );

  // Handle chip removal
  const handleRemoveChip = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });

    setSelectedMaterials(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  // Filter and flatten materials for FlatList
  const flatListData = useMemo((): FlatListItem[] => {
    const query = searchQuery.toLowerCase().trim();
    const items: FlatListItem[] = [];
    const categoryMap = new Map<string, Material[]>();

    // Group by category
    allMaterials.forEach(material => {
      const category = material.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(material);
    });

    // Build flattened list with filtering
    categoryMap.forEach((materials, category) => {
      const filteredMaterials: { material: Material; filteredGrades: MaterialGrade[] }[] = [];

      materials.forEach(material => {
        const matchesMaterial = !query || material.name.toLowerCase().includes(query);
        const grades = material.grades || [];

        // Filter grades based on search
        const filteredGrades = query
          ? grades.filter(
              grade =>
                matchesMaterial || grade.name.toLowerCase().includes(query)
            )
          : grades;

        // Include if material name matches or has matching grades
        if (matchesMaterial || filteredGrades.length > 0) {
          filteredMaterials.push({
            material,
            filteredGrades: query ? filteredGrades : grades,
          });
        }
      });

      if (filteredMaterials.length > 0) {
        // Add category header
        items.push({
          type: 'category',
          id: `cat-${category}`,
          data: { category },
        });

        // Add materials and grades
        filteredMaterials.forEach(({ material, filteredGrades }) => {
          // Add material header
          items.push({
            type: 'material',
            id: `mat-${material.id}`,
            data: {
              materialId: material.id,
              materialName: material.name,
              category,
            },
          });

          // Add grades
          if (filteredGrades.length > 0) {
            filteredGrades.forEach(grade => {
              items.push({
                type: 'grade',
                id: `grade-${material.id}-${grade.id}`,
                data: {
                  materialId: material.id,
                  materialName: material.name,
                  gradeId: grade.id,
                  gradeName: grade.name,
                  category,
                },
              });
            });
          } else {
            // No grades - show "All Grades" option
            items.push({
              type: 'grade',
              id: `grade-${material.id}-0`,
              data: {
                materialId: material.id,
                materialName: material.name,
                gradeId: 0,
                gradeName: 'All Grades',
                category,
              },
            });
          }
        });
      }
    });

    return items;
  }, [allMaterials, searchQuery]);

  // Selected materials list for chips
  const selectedMaterialsList = useMemo(
    () => Array.from(selectedMaterials.entries()),
    [selectedMaterials]
  );

  // Handle save and continue
  const handleSaveAndContinue = useCallback(() => {
    const selectedData = Array.from(selectedMaterials.values()).map(item => ({
      material_id: item.materialId,
      material_name: item.materialName,
      grade_id: item.gradeId,
      grade_name: item.gradeName,
      category: item.category,
    }));

    navigation.navigate(SCREENS.AUTH.MILL_BRAND_DETAILS, {
      profileData: {
        ...profileData,
        materials: selectedData,
      },
    });
  }, [selectedMaterials, navigation, profileData]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Render item for FlatList
  const renderItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'category':
          return (
            <View style={styles.categorySection}>
              <Text
                variant="captionMedium"
                fontWeight="semibold"
                style={styles.categoryHeader}
              >
                {item.data.category}
              </Text>
            </View>
          );

        case 'material':
          return (
            <View
              style={[
                styles.materialItem,
                { borderBottomWidth: 0, paddingBottom: theme.spacing[1] },
              ]}
            >
              <Text
                variant="bodyMedium"
                fontWeight="semibold"
                style={styles.materialItemName}
              >
                {item.data.materialName}
              </Text>
            </View>
          );

        case 'grade':
          return (
            <GradeItem
              materialId={item.data.materialId!}
              materialName={item.data.materialName!}
              gradeId={item.data.gradeId!}
              gradeName={item.data.gradeName!}
              category={item.data.category!}
              isSelected={isGradeSelected(item.data.materialId!, item.data.gradeId!)}
              onToggle={handleGradeToggle}
              styles={styles}
              theme={theme}
            />
          );

        default:
          return null;
      }
    },
    [styles, theme, isGradeSelected, handleGradeToggle]
  );

  // Key extractor
  const keyExtractor = useCallback((item: FlatListItem) => item.id, []);

  // Get item layout for better performance
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ESTIMATED_ITEM_HEIGHT,
      offset: ESTIMATED_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Footer component for loading more
  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: theme.spacing[4], alignItems: 'center' }}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, theme]);

  // Empty component
  const ListEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={{ paddingVertical: theme.spacing[8], alignItems: 'center' }}>
        <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary }}>
          {searchQuery
            ? 'No materials found matching your search'
            : 'No materials available'}
        </Text>
      </View>
    );
  }, [isLoading, searchQuery, theme]);

  // Header component with search and chips
  const ListHeaderComponent = useCallback(
    () => (
      <>
        <Text variant="h3" fontWeight="bold" style={styles.title}>
          What materials do you deal in?
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          Select the specific grades of paper, machinery, or packaging materials
          you buy or sell to get better matches.
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>
              🔍
            </Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search materials (e.g., Duplex Board)"
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {selectedMaterialsList.length > 0 && (
          <View style={styles.selectedChipsContainer}>
            {selectedMaterialsList.map(([key, material]) => (
              <SelectionChip
                key={key}
                selectionKey={key}
                materialName={material.materialName}
                gradeName={material.gradeName}
                onRemove={handleRemoveChip}
                styles={styles}
              />
            ))}
          </View>
        )}
      </>
    ),
    [
      styles,
      theme,
      searchQuery,
      selectedMaterialsList,
      handleRemoveChip,
    ]
  );

  // Calculate bottom padding for scrollable content
  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  // Loading state
  if (isLoading) {
    return (
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text
            variant="bodyMedium"
            style={{
              marginTop: theme.spacing[4],
              color: theme.colors.text.secondary,
            }}
          >
            Loading materials...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (isError) {
    return (
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.error.DEFAULT,
              marginBottom: theme.spacing[4],
            }}
          >
            Failed to load materials
          </Text>
          <TouchableOpacity
            style={[styles.button, { paddingHorizontal: theme.spacing[6] }]}
            onPress={() => refetch()}
          >
            <Text variant="buttonMedium" style={styles.buttonText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
      );
    }

  return (
    <>
      <ScreenWrapper
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
      >
        <FlatList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: theme.spacing[4], paddingBottom: bottomPadding },
          ]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
                      />
      </ScreenWrapper>

      {/* Floating Bottom Button */}
      <FloatingBottomContainer>
        <TouchableOpacity
          style={[styles.button, selectedKeys.size === 0 && { opacity: 0.5 }]}
          onPress={handleSaveAndContinue}
          activeOpacity={0.8}
          disabled={selectedKeys.size === 0}
        >
          <Text variant="buttonMedium" style={styles.buttonText}>
            Save & Continue ({selectedKeys.size} selected)
          </Text>
          <AppIcon.ArrowRight
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>
      </FloatingBottomContainer>
    </>
  );
};

export default MaterialsScreen;
