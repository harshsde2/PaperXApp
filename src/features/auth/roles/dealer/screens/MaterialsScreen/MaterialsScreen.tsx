import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
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
import {
  MaterialsScreenNavigationProp,
  SelectedMaterial,
  ThicknessRange,
} from './@types';
import { createStyles } from './styles';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import {
  useGetMaterialsInfinite,
  Material,
  MaterialGrade,
} from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ITEMS_PER_PAGE = 5;
const END_REACHED_THRESHOLD = 0.2;

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
    category: string,
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
  },
);

GradeItem.displayName = 'GradeItem';

interface SelectionChipProps {
  selectionKey: string;
  materialName: string;
  gradeName: string;
  thicknessLabel?: string;
  onRemove: (key: string) => void;
  styles: ReturnType<typeof createStyles>;
}

const SelectionChip = memo(
  ({
    selectionKey,
    materialName,
    gradeName,
    thicknessLabel,
    onRemove,
    styles,
  }: SelectionChipProps) => {
    const handlePress = useCallback(() => {
      onRemove(selectionKey);
    }, [selectionKey, onRemove]);

    return (
      <TouchableOpacity
        style={styles.chip}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.chipContent}>
          <Text variant="bodySmall" fontWeight="medium" style={styles.chipText}>
            {materialName} - {gradeName}
            {thicknessLabel ? ` • ${thicknessLabel}` : ''}
          </Text>
        </View>
        <Text style={styles.chipText}>×</Text>
      </TouchableOpacity>
    );
  },
);

SelectionChip.displayName = 'SelectionChip';

const MaterialsScreen = () => {
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Materials'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { profileData } = route.params || {};

  console.log('profileData', JSON.stringify(profileData, null, 2));

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
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState<
    Map<string, SelectedMaterial>
  >(new Map());

  const isLoadingMoreRef = useRef(false);
  const scrollViewRef = useRef<FlatList>(null);
  const allMaterials = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.materials);
  }, [data?.pages]);

  const getSelectionKey = useCallback(
    (materialId: number, gradeId: number) => `${materialId}-${gradeId}`,
    [],
  );

  const isGradeSelected = useCallback(
    (materialId: number, gradeId: number) =>
      selectedKeys.has(getSelectionKey(materialId, gradeId)),
    [selectedKeys, getSelectionKey],
  );

  const handleGradeToggle = useCallback(
    (
      materialId: number,
      materialName: string,
      gradeId: number,
      gradeName: string,
      category: string,
    ) => {
      const key = getSelectionKey(materialId, gradeId);

      // If already selected, just remove selection (and its thickness)
      if (selectedKeys.has(key)) {
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

        return;
      }

      // If not selected yet, open thickness selector as a modal, then specs selector
      // and capture both results via callbacks
      const onThicknessSelected = (thicknessRanges: ThicknessRange[]) => {
        // Store thickness ranges temporarily - will be finalized after specs selection
        setSelectedKeys(prev => {
          const newSet = new Set(prev);
          newSet.add(key);
          return newSet;
        });

        setSelectedMaterials(prev => {
          const newMap = new Map(prev);
          newMap.set(key, {
            materialId,
            materialName,
            gradeId,
            gradeName,
            category,
            thicknessRanges: thicknessRanges,
          });
          return newMap;
        });
      };

      const onSpecsSelected = (specs: {
        finish_ids: number[];
        coating_ids: number[];
        surface_ids: number[];
        grade_ids: number[];
        variant_ids: number[];
        custom_specs: string[];
      }) => {
        // Update the material with finish_ids (combining all finish-related IDs)
        setSelectedMaterials(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(key);
          if (existing) {
            // Combine all finish-related IDs into finish_ids array
            const allFinishIds = [
              ...specs.finish_ids,
              ...specs.coating_ids,
              ...specs.surface_ids,
              ...specs.grade_ids,
              ...specs.variant_ids,
            ];
            newMap.set(key, {
              ...existing,
              finishIds: allFinishIds.length > 0 ? allFinishIds : undefined,
            });
          }
          return newMap;
        });
      };

      const onBrandDetailsSelected = (details: {
        brand_id: number | null;
        agent_type: string | null;
      }) => {
        // Update the material with brand_id and agent_type
        setSelectedMaterials(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(key);
          if (existing) {
            newMap.set(key, {
              ...existing,
              brandId: details.brand_id,
              agentType: details.agent_type,
            });
          }
          return newMap;
        });
      };

      navigation.navigate(SCREENS.AUTH.SELECT_THICKNESS, {
        onThicknessSelected,
        onSpecsSelected,
        onBrandDetailsSelected,
        materialKey: key,
        materialId,
      });
    },
    [getSelectionKey, navigation, selectedKeys],
  );

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

  const flatListData = useMemo((): FlatListItem[] => {
    const query = searchQuery.toLowerCase().trim();
    const items: FlatListItem[] = [];
    const categoryMap = new Map<string, Material[]>();

    allMaterials.forEach(material => {
      const category = material.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(material);
    });

    categoryMap.forEach((materials, category) => {
      const filteredMaterials: {
        material: Material;
        filteredGrades: MaterialGrade[];
      }[] = [];

      materials.forEach(material => {
        const matchesMaterial =
          !query || material.name.toLowerCase().includes(query);
        const grades = material.grades || [];

        const filteredGrades = query
          ? grades.filter(
              grade =>
                matchesMaterial || grade.name.toLowerCase().includes(query),
            )
          : grades;

        if (matchesMaterial || filteredGrades.length > 0) {
          filteredMaterials.push({
            material,
            filteredGrades: query ? filteredGrades : grades,
          });
        }
      });

      if (filteredMaterials.length > 0) {
        items.push({
          type: 'category',
          id: `cat-${category}`,
          data: { category },
        });

        filteredMaterials.forEach(({ material, filteredGrades }) => {
          items.push({
            type: 'material',
            id: `mat-${material.id}`,
            data: {
              materialId: material.id,
              materialName: material.name,
              category,
            },
          });

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

  const selectedMaterialsList = useMemo(
    () => Array.from(selectedMaterials.entries()),
    [selectedMaterials],
  );

  const handleSaveAndContinue = useCallback(() => {
    const selectedData = Array.from(selectedMaterials.values()).map(item => ({
      material_id: item.materialId,
      material_name: item.materialName,
      grade_id: item.gradeId,
      grade_name: item.gradeName,
      category: item.category,
      finish_ids: item.finishIds || [],
      brand_id: item.brandId ?? null,
      agent_type: item.agentType ?? null,
      thickness_ranges:
        item.thicknessRanges?.map(range => ({
          unit: range.unit,
          min: range.min,
          max: range.max,
        })) || [],
    }));

    // console.log('selectedData', JSON.stringify(selectedData, null, 2));
    navigation.navigate(SCREENS.AUTH.MANAGE_WAREHOUSES, {
      dealerRegistrationData: {
        profileData: profileData,
        materials: selectedData,
      },
    } as any);
  }, [selectedMaterials, navigation]);

  const hasMorePages = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return true;
    const lastPage = data.pages[data.pages.length - 1];
    const hasNext = lastPage?.pagination?.has_next === true;
    const gotFullPage = (lastPage?.materials?.length || 0) >= ITEMS_PER_PAGE;
    return hasNext || gotFullPage;
  }, [data?.pages]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current || isFetchingNextPage) {
      return;
    }

    const canLoadMore = hasNextPage !== false || hasMorePages;

    if (!canLoadMore) {
      return;
    }

    isLoadingMoreRef.current = true;

    fetchNextPage().catch(error => {
      console.error('Error fetching next page:', error);
      isLoadingMoreRef.current = false;
    });
  }, [hasNextPage, hasMorePages, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (!isFetchingNextPage) {
      const timer = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      if (!contentSize.height || !layoutMeasurement.height) {
        return;
      }

      const distanceFromEnd =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      const paddingToBottom = 500;

      const isCloseToBottom = distanceFromEnd < paddingToBottom;
      const canLoadMore =
        (hasNextPage !== false || hasMorePages) &&
        !isFetchingNextPage &&
        !isLoadingMoreRef.current;

      if (isCloseToBottom && canLoadMore) {
        handleLoadMore();
      }
    },
    [hasNextPage, hasMorePages, isFetchingNextPage, handleLoadMore],
  );

  // console.log('selectedMaterialsList', selectedMaterialsList);

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
              isSelected={isGradeSelected(
                item.data.materialId!,
                item.data.gradeId!,
              )}
              onToggle={handleGradeToggle}
              styles={styles}
              theme={theme}
            />
          );

        default:
          return null;
      }
    },
    [styles, theme, isGradeSelected, handleGradeToggle],
  );

  const keyExtractor = useCallback((item: FlatListItem) => item.id, []);

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

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={{ paddingVertical: theme.spacing[8], alignItems: 'center' }}>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.text.tertiary }}
        >
          {searchQuery
            ? 'No materials found matching your search'
            : 'No materials available'}
        </Text>
      </View>
    );
  }, [isLoading, searchQuery, theme]);

  const buttonHeight = 60;
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

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
          <ActivityIndicator
            size="large"
            color={theme.colors.primary.DEFAULT}
          />
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
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            What materials do you deal in?
          </Text>

          <Text variant="bodyMedium" style={styles.description}>
            Select the specific grades of paper, machinery, or packaging
            materials you buy or sell to get better matches.
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <AppIcon.Search
                width={20}
                height={20}
                color={theme.colors.text.tertiary}
              />
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
              {selectedMaterialsList.map(([key, material]) => {
                const thicknessRanges = material.thicknessRanges || [];
                const thicknessLabel =
                  thicknessRanges.length > 0
                    ? thicknessRanges.length === 1
                      ? `${thicknessRanges[0].min}-${thicknessRanges[0].max} ${thicknessRanges[0].unit}`
                      : `${thicknessRanges.length} ranges`
                    : undefined;

                return (
                  <SelectionChip
                    key={key}
                    selectionKey={key}
                    materialName={material.materialName}
                    gradeName={material.gradeName}
                    thicknessLabel={thicknessLabel}
                    onRemove={handleRemoveChip}
                    styles={styles}
                  />
                );
              })}
            </View>
          )}

          <FlatList
            ref={scrollViewRef}
            data={flatListData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: bottomPadding },
            ]}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={END_REACHED_THRESHOLD}
            onScroll={handleScroll}
            scrollEnabled={true}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          />
        </View>
      </ScreenWrapper>

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
