import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { Card } from '@shared/components/Card';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { MaterialSpecsScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useGetMaterialFinishesInfinite, MaterialFinish } from '@services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Type mapping for display
const TYPE_DISPLAY_NAMES: Record<string, string> = {
  finish: 'Finish',
  coating: 'Coating',
  surface: 'Surface',
  grade: 'Grade',
  variant: 'Variant',
};

const MaterialSpecsScreen = () => {
  const navigation = useNavigation<MaterialSpecsScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'MaterialSpecs'>>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  // Get params from route
  const { onSpecsSelected, materialKey, onBrandDetailsSelected } = route.params || {};

  // Fetch material finishes from API with pagination (no material_id needed)
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMaterialFinishesInfinite(50);

  // Flatten all pages into a single array
  const finishes = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.finishes);
  }, [data?.pages]);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
  const [customInput, setCustomInput] = useState('');

  // Group finishes by type
  const sections = useMemo(() => {
    const typeMap = new Map<string, MaterialFinish[]>();

    finishes.forEach(finish => {
      const type = finish.type || 'other';
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(finish);
    });

    // Convert to array and sort by type order
    const typeOrder = ['finish', 'coating', 'surface', 'grade', 'variant'];
    return Array.from(typeMap.entries())
      .map(([type, items]) => ({
        id: type,
        title: TYPE_DISPLAY_NAMES[type] || type.charAt(0).toUpperCase() + type.slice(1),
        options: items.map(item => ({
          id: item.id,
          label: item.name,
        })),
      }))
      .sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.id);
        const bIndex = typeOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
  }, [finishes]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleOption = (optionId: number) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const getSelectedCountForSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.options.filter(opt => selectedOptions.has(opt.id)).length;
  };

  let totalSelectedCount = selectedOptions.size;

  // //todo: add custom specs to the material specs data
  // totalSelectedCount = 1

  const handleClearAll = () => {
    setSelectedOptions(new Set());
  };

  const handleConfirm = () => {
    // Prepare selected finishes data
    const selectedFinishes = Array.from(selectedOptions).map(id => {
      const finish = finishes.find(f => f.id === id);
      return {
        id: finish?.id,
        name: finish?.name,
        type: finish?.type,
      };
    });

    const materialSpecsData = {
      finish_ids: selectedFinishes.filter(f => f.type === 'finish').map(f => f.id).filter((id): id is number => id !== undefined),
      coating_ids: selectedFinishes.filter(f => f.type === 'coating').map(f => f.id).filter((id): id is number => id !== undefined),
      surface_ids: selectedFinishes.filter(f => f.type === 'surface').map(f => f.id).filter((id): id is number => id !== undefined),
      grade_ids: selectedFinishes.filter(f => f.type === 'grade').map(f => f.id).filter((id): id is number => id !== undefined),
      variant_ids: selectedFinishes.filter(f => f.type === 'variant').map(f => f.id).filter((id): id is number => id !== undefined),
      custom_specs: customInput.trim() ? [customInput.trim()] : [],
    };

    if (onSpecsSelected) {
      // Called from Materials screen via callback (after thickness selection)
      onSpecsSelected(materialSpecsData);
      
      // If onBrandDetailsSelected is provided, navigate to MillBrandDetailsScreen
      if (onBrandDetailsSelected) {
        navigation.navigate(SCREENS.AUTH.MILL_BRAND_DETAILS, {
          onBrandDetailsSelected,
          materialKey,
        });
        return;
      }
      
      // Otherwise, close both modals and return to MaterialsScreen
      if (navigation.canGoBack()) {
        navigation.pop(2);
      } else {
        navigation.goBack();
      }
      return;
    }

    // Fallback: existing flow if no callback is provided
    navigation.goBack();
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      // Custom specs are stored separately, not as finish IDs
      // They'll be included in the material_specs.custom_specs array
      setCustomInput('');
    }
  };

  // Infinite scroll handling
  const isLoadingMoreRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current || isFetchingNextPage || !hasNextPage) {
      return;
    }

    isLoadingMoreRef.current = true;
    fetchNextPage().catch((error) => {
      console.error('Error fetching next page:', error);
      isLoadingMoreRef.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (!isFetchingNextPage) {
      const timer = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage]);

  // Calculate bottom padding for scrollable content
  const buttonHeight = 100; // Approximate footer height
  const bottomPadding = buttonHeight + theme.spacing[4] * 2 + insets.bottom;

  return (
    <>
      <ScreenWrapper
        scrollable
        backgroundColor={theme.colors.background.secondary}
        safeAreaEdges={[]}
        contentContainerStyle={{
          ...styles.scrollContent,
          paddingBottom: bottomPadding,
        }}
        scrollViewProps={{
          onScroll: (event: any) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            
            if (!contentSize.height || !layoutMeasurement.height) {
              return;
            }

            const distanceFromEnd = contentSize.height - (layoutMeasurement.height + contentOffset.y);
            const paddingToBottom = 500;
            
            const isCloseToBottom = distanceFromEnd < paddingToBottom;
            const canLoadMore = hasNextPage && !isFetchingNextPage && !isLoadingMoreRef.current;

            if (isCloseToBottom && canLoadMore) {
              handleLoadMore();
            }
          },
          scrollEventThrottle: 16,
        }}
      >
        <View style={styles.container}>
          <Text variant="h3" fontWeight="bold" style={styles.title}>
            Select Grades & Finishes
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Specify technical attributes for your request. Multiple selections allowed per category.
          </Text>

          {isLoading ? (
            <Card style={styles.card}>
              <View style={{ padding: theme.spacing[8], alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
                <Text variant="bodyMedium" style={{ marginTop: theme.spacing[4], color: theme.colors.text.secondary }}>
                  Loading finishes...
                </Text>
              </View>
            </Card>
          ) : isError ? (
            <Card style={styles.card}>
              <View style={{ padding: theme.spacing[8], alignItems: 'center' }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.error.DEFAULT, marginBottom: theme.spacing[4] }}>
                  Failed to load finishes
                </Text>
                <TouchableOpacity
                  onPress={() => refetch()}
                  style={[styles.button, { paddingHorizontal: theme.spacing[6] }]}
                >
                  <Text variant="buttonMedium" style={styles.buttonText}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : sections.length === 0 ? (
            <Card style={styles.card}>
              <View style={{ padding: theme.spacing[8], alignItems: 'center' }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.text.tertiary }}>
                  No finishes available
                </Text>
              </View>
            </Card>
          ) : (
            <>
              {sections.map(section => {
              const isExpanded = expandedSections.has(section.id);
              const selectedCount = getSelectedCountForSection(section.id);

              return (
                <Card activeOpacity={0.9} onPress={() => toggleSection(section.id)} key={section.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    disabled={true}
                  >
                    <View style={styles.sectionHeaderLeft}>
                      <Text variant="bodyMedium" fontWeight="semibold" style={styles.sectionTitle}>
                        {section.title}
                      </Text>
                      {selectedCount > 0 && (
                        <View style={styles.badge}>
                          <Text variant="captionSmall" fontWeight="semibold" style={styles.badgeText}>
                            {selectedCount} Selected
                          </Text>
                        </View>
                      )}
                    </View>
                    <AppIcon.ChevronDown
                      width={20}
                      height={20}
                      color={theme.colors.text.tertiary}
                      style={{
                        transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                      }}
                    />
                  </TouchableOpacity>

                  {!isExpanded && selectedCount === 0 && (
                    <Text variant="captionMedium" style={styles.sectionSubtitle}>
                      Select options
                    </Text>
                  )}

                  {isExpanded && (
                    <>
                      <Text variant="captionMedium" style={styles.sectionInstruction}>
                        Select one or more {section.title.toLowerCase()} types.
                      </Text>
                      <View style={styles.optionsGrid}>
                        {section.options.map(option => {
                          const isSelected = selectedOptions.has(option.id);
                          return (
                            <TouchableOpacity
                              key={option.id}
                              style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                              onPress={() => toggleOption(option.id)}
                              activeOpacity={0.7}
                            >
                              {isSelected && (
                                <AppIcon.TickCheckedBox
                                  width={16}
                                  height={16}
                                  color={theme.colors.text.inverse}
                                />
                              )}
                              <Text
                                variant="bodySmall"
                                fontWeight="medium"
                                style={[
                                  styles.optionChipText,
                                  isSelected && styles.optionChipTextSelected,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  )}
                </Card>
              );
            })}
              {isFetchingNextPage && (
                <Card style={styles.card}>
                  <View style={{ padding: theme.spacing[4], alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
                    <Text variant="captionMedium" style={{ marginTop: theme.spacing[2], color: theme.colors.text.secondary }}>
                      Loading more...
                    </Text>
                  </View>
                </Card>
              )}
            </>
          )}

          <Card style={styles.card}>
            <View style={styles.customInputSection}>
              <View style={styles.customInputLabel}>
                <Text style={{ fontSize: 16 }}>✏️</Text>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.sectionTitle}>
                  Can't find what you need?
                </Text>
              </View>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Type specific grade or finish..."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={customInput}
                  onChangeText={setCustomInput}
                />
                <TouchableOpacity onPress={handleAddCustom} activeOpacity={0.7} style={styles.addButton}>
                  <Text style={{ fontSize: 20, color: theme.colors.primary.DEFAULT }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>
      </ScreenWrapper>

      {/* Floating Bottom Footer */}
      <FloatingBottomContainer>
        <View style={styles.footerTop}>
          <Text variant="bodyMedium" style={styles.footerItemCount}>
            {totalSelectedCount} item{totalSelectedCount !== 1 ? 's' : ''} selected
          </Text>
          {totalSelectedCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7} style={styles.clearAllButton}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.clearAllButtonText}>
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, totalSelectedCount === 0 && { opacity: 0.5 }]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={totalSelectedCount === 0}
        >
          <Text variant="buttonMedium" style={styles.confirmButtonText}>
            Confirm Selection
          </Text>
          <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </FloatingBottomContainer>
    </>
  );
};

export default MaterialSpecsScreen;
