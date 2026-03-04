import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
} from 'react-native';
import { SelectedMaterialsModal } from './components/SelectedMaterialsModal';
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
import { useGetMaterialsInfinite, Material, useCreateMaterial } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appContent } from '@utils/appContent';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';

const ITEMS_PER_PAGE = 50;
const END_REACHED_THRESHOLD = 0.2;

interface FlatListItem {
  type: 'material';
  id: string;
  data: {
    materialId: number;
    materialName: string;
    gradeId: number;
    gradeName: string;
    category: string;
  };
}

interface MaterialItemProps {
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

const MaterialItem = memo(
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
  }: MaterialItemProps) => {
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
            {materialName}
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

MaterialItem.displayName = 'MaterialItem';

const MaterialsScreen = () => {
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Materials'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

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
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [isCustomMaterialModalVisible, setIsCustomMaterialModalVisible] =
    useState(false);
  const [isSelectedMaterialsModalVisible, setIsSelectedMaterialsModalVisible] =
    useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const { mutateAsync: createMaterial, isPending: isCreatingMaterial } = useCreateMaterial();
  const [selectedMaterials, setSelectedMaterials] = useState<
    Map<string, SelectedMaterial>
  >(new Map());

  const isLoadingMoreRef = useRef(false);
  const scrollViewRef = useRef<FlatList>(null);
  const allMaterials = useMemo(() => {
    if (!data?.pages) return [];
    const allMaterialsList = data.pages.flatMap(page => page.materials);
    
    // Deduplicate materials by name and category (normalized) to avoid duplicates across pages
    const materialsMap = new Map<string, Material>();
    allMaterialsList.forEach(material => {
      const key = `${(material.name || '').toLowerCase().trim()}-${(material.category || 'Other').toLowerCase().trim()}`;
      if (!materialsMap.has(key)) {
        materialsMap.set(key, material);
      }
    });
    
    return Array.from(materialsMap.values());
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
        finish_names?: string[];
      }) => {
        // Update the material with finish_ids and finish_names
        setSelectedMaterials(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(key);
          if (existing) {
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
              finishNames: specs.finish_names ?? [],
            });
          }
          return newMap;
        });
      };

      const onBrandDetailsSelected = (details: {
        brand_id: number | null;
        agent_type: string | null;
        brand_name?: string | null;
      }) => {
        // Update the material with brand_id, brand_name and agent_type
        setSelectedMaterials(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(key);
          if (existing) {
            newMap.set(key, {
              ...existing,
              brandId: details.brand_id,
              brandName: details.brand_name ?? null,
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

  const handleAddCustomMaterial = useCallback(async () => {
    const name = customMaterialName.trim();
    if (!name) {
      dispatch(showToast({ message: 'Please enter a material name', type: 'error' }));
      return;
    }
    try {
      const material = await createMaterial({ name });
      const firstGrade = material?.grades?.[0];
      if (material && firstGrade) {
        const category = material.category || 'Custom';
        handleGradeToggle(
          material.id,
          material.name,
          firstGrade.id,
          firstGrade.name,
          category,
        );
        setCustomMaterialName('');
        setIsCustomMaterialModalVisible(false);
        dispatch(showToast({ message: 'Material added successfully', type: 'success' }));
      } else {
        dispatch(showToast({ message: 'Failed to add material', type: 'error' }));
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to add material';
      dispatch(showToast({ message: msg, type: 'error' }));
    }
  }, [customMaterialName, createMaterial, handleGradeToggle, dispatch]);

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

    // One row per material (using first grade for backend compatibility)
    allMaterials.forEach(material => {
      const grades = material.grades || [];
      if (grades.length === 0) return;

      const firstGrade = grades[0];
      const category = material.category || 'Other';
      const matchesMaterial = !query || (material.name || '').toLowerCase().includes(query);

      if (matchesMaterial) {
        items.push({
          type: 'material',
          id: `material-${material.id}`,
          data: {
            materialId: material.id,
            materialName: material.name,
            gradeId: firstGrade.id,
            gradeName: firstGrade.name,
            category,
          },
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
      return (
        <MaterialItem
          materialId={item.data.materialId}
          materialName={item.data.materialName}
          gradeId={item.data.gradeId}
          gradeName={item.data.gradeName}
          category={item.data.category}
          isSelected={isGradeSelected(
            item.data.materialId,
            item.data.gradeId,
          )}
          onToggle={handleGradeToggle}
          styles={styles}
          theme={theme}
        />
      );
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
            {appContent.MaterialRegistration.Headline}
          </Text>

          <Text variant="bodyMedium" style={styles.description}>
            {appContent.MaterialRegistration.Subheadline}
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
              placeholder="Search Materials"
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {selectedMaterialsList.length > 0 && (
            <TouchableOpacity
              style={styles.selectedCountPill}
              onPress={() => setIsSelectedMaterialsModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text
                variant="bodyMedium"
                fontWeight="medium"
                style={styles.selectedCountPillText}
              >
                {selectedMaterialsList.length} material
                {selectedMaterialsList.length !== 1 ? 's' : ''} selected
              </Text>
              <AppIcon.ChevronDown
                width={20}
                height={20}
                style={{ marginLeft: theme.spacing[2] }}
                color={theme.colors.text.inverse}
              />
            </TouchableOpacity>
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

      <SelectedMaterialsModal
        visible={isSelectedMaterialsModalVisible}
        onClose={() => setIsSelectedMaterialsModalVisible(false)}
        selectedMaterials={selectedMaterialsList}
        onRemove={handleRemoveChip}
      />

      <Modal
        visible={isCustomMaterialModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCustomMaterialModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text variant="h4" fontWeight="semibold" style={styles.modalTitle}>
              Add Custom Material
            </Text>
            <TextInput
              style={styles.customMaterialInput}
              placeholder="Enter material name"
              placeholderTextColor={theme.colors.text.tertiary}
              value={customMaterialName}
              onChangeText={setCustomMaterialName}
              editable={!isCreatingMaterial}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsCustomMaterialModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text variant="bodyMedium" style={styles.modalCancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addMaterialButton, isCreatingMaterial && { opacity: 0.6 }]}
                onPress={handleAddCustomMaterial}
                disabled={isCreatingMaterial || !customMaterialName.trim()}
                activeOpacity={0.8}
              >
                {isCreatingMaterial ? (
                  <ActivityIndicator size="small" color={theme.colors.text.inverse} />
                ) : (
                  <Text variant="bodyMedium" fontWeight="medium" style={styles.buttonText}>
                    Add
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FloatingBottomContainer>
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIsCustomMaterialModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text variant="buttonMedium" style={styles.secondaryButtonText}>
              Add Custom
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.halfButton,
              selectedKeys.size === 0 && { opacity: 0.5 },
            ]}
            onPress={handleSaveAndContinue}
            activeOpacity={0.8}
            disabled={selectedKeys.size === 0}
          >
            <Text variant="buttonMedium" style={styles.buttonText}>
              Continue ({selectedKeys.size})
            </Text>
            <AppIcon.ArrowRight
              width={20}
              height={20}
              color={theme.colors.text.inverse}
            />
          </TouchableOpacity>
        </View>
      </FloatingBottomContainer>
    </>
  );
};

export default MaterialsScreen;
