import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import {
  useGetConverterRtdProducts,
  useUpdateRtdProduct,
  usePauseRtdProduct,
  useResumeRtdProduct,
} from '@services/api';
import type { RtdProduct } from '@services/api';
import { SCREENS } from '@navigation/constants';
import type { ProductTab } from './@types';
import { createStyles } from './styles';
import { useSkeleton } from '@shared/hooks/useSkeleton';
import { ListItemSkeleton } from '@shared/components/skeletons';

const TABS: { key: ProductTab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'draft', label: 'Draft' },
];

const LEAD_TIME_LABELS: Record<string, string> = {
  SAME_DAY: 'Same Day Lead',
  H24: '24 Hours Lead',
  H48: '48 Hours Lead',
  DAYS_3_5: '3-5 Days Lead',
};

export const ConverterRTDMyProductsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ProductTab>('active');
  const [search, setSearch] = useState('');

  const statusFilter = activeTab === 'draft' ? 'pending' : activeTab;
  const {
    data: products = [],
    isLoading,
    refetch,
    isRefetching,
  } = useGetConverterRtdProducts({ status: statusFilter });
  const showSkeleton = useSkeleton(isLoading);

  const updateProduct = useUpdateRtdProduct();
  const pauseProduct = usePauseRtdProduct();
  const resumeProduct = useResumeRtdProduct();

  const getProductTitle = (p: RtdProduct) => p.display_name ?? p.product_name ?? p.category ?? '';
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        getProductTitle(p).toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)),
    );
  }, [products, search]);

  const handleAddProduct = useCallback(() => {
    navigation.navigate(SCREENS.CONVERTER_RTD.ADD_PRODUCT);
  }, [navigation]);

  const handleToggleBuyNow = useCallback(
    (product: RtdProduct) => {
      updateProduct.mutate({
        id: product.id,
        data: { buy_now_enabled: !product.buy_now_enabled },
      });
    },
    [updateProduct],
  );

  const handlePause = useCallback(
    (id: number) => {
      pauseProduct.mutate(id);
    },
    [pauseProduct],
  );

  const handleResume = useCallback(
    (id: number) => {
      resumeProduct.mutate(id);
    },
    [resumeProduct],
  );

  const handleEdit = useCallback(
    (product: RtdProduct) => {
      navigation.navigate(SCREENS.CONVERTER_RTD.ADD_PRODUCT, { productId: product.id });
    },
    [navigation],
  );

  const getLeadTimeLabel = (leadTime: string | null) => {
    if (!leadTime) return null;
    return LEAD_TIME_LABELS[leadTime] ?? leadTime;
  };

  const renderProductCard = useCallback(
    ({ item }: { item: RtdProduct }) => {
      const leadLabel = getLeadTimeLabel(item.lead_time);

      return (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            {item.image_path ? (
              <Image
                source={{ uri: item.image_path }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <AppIcon.Market width={36} height={36} color={theme.colors.text.tertiary} />
              </View>
            )}
            <View style={styles.cardContent}>
              <View>
                <View style={styles.cardNameRow}>
                  <Text fontWeight={'semibold'} style={styles.cardName} numberOfLines={2}>
                    {item.display_name ?? item.product_name ?? item.category}
                  </Text>
                  {leadLabel && (
                    <View style={styles.leadTimeBadge}>
                      <Text fontWeight={'semibold'} style={styles.leadTimeBadgeText}>{leadLabel}</Text>
                    </View>
                  )}
                </View>
                {item.category && (
                  <Text style={styles.cardSku}>SKU: {item.category}</Text>
                )}
              </View>
              <View>
                <Text style={styles.cardMoq}>MOQ: {item.moq} Units</Text>
                <View style={styles.cardPriceRow}>
                  <Text fontWeight={'semibold'} style={styles.cardPrice}>₹{item.base_price}</Text>
                  <Text fontWeight={'semibold'} style={styles.cardPriceUnit}>/ unit</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.buyNowRow}>
              <Text fontWeight={'semibold'}  style={styles.buyNowLabel}>Buy Now</Text>
              <Switch
                value={item.buy_now_enabled}
                onValueChange={() => handleToggleBuyNow(item)}
                trackColor={{
                  false: theme.colors.border.secondary,
                  true: theme.colors.primary.DEFAULT,
                }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
            <View style={styles.footerActions}>
              {activeTab === 'active' && (
                <TouchableOpacity
                  style={styles.pauseButton}
                  onPress={() => handlePause(item.id)}
                  activeOpacity={0.7}
                >
                  <AppIcon.Pause width={10} height={10} color="#000" />
                  <Text fontWeight={'semibold'} style={styles.pauseButtonText}>Pause</Text>
                </TouchableOpacity>
              )}
              {activeTab === 'paused' && (
                <TouchableOpacity
                  style={styles.pauseButton}
                  onPress={() => handleResume(item.id)}
                  activeOpacity={0.7}
                >
                  <AppIcon.Play width={10} height={10} color="#000" />
                  <Text fontWeight={'semibold'} style={styles.pauseButtonText}>Resume</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <AppIcon.Edit width={10} height={10} color="#FFFFFF" />
                <Text fontWeight={'semibold'} style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [
      styles,
      theme,
      activeTab,
      handleToggleBuyNow,
      handlePause,
      handleResume,
      handleEdit,
    ],
  );

  const renderEmpty = useCallback(() => {
    if (showSkeleton) {
      return (
        <View style={styles.emptyContainer}>
          <ListItemSkeleton count={6} />
        </View>
      );
    }
    const tabLabel = TABS.find((t) => t.key === activeTab)?.label ?? activeTab;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No {tabLabel} Products</Text>
        <Text style={styles.emptySubText}>
          {activeTab === 'active'
            ? 'Add a new product to start receiving orders.'
            : `You have no ${tabLabel.toLowerCase()} products right now.`}
        </Text>
      </View>
    );
  }, [showSkeleton, activeTab, styles]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
            <AppIcon.ArrowLeft width={22} height={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text fontWeight={'bold'} style={styles.headerTitle}>My Products</Text>
        </View>
        {/* <TouchableOpacity style={styles.addButton} onPress={handleAddProduct} activeOpacity={0.8}> */}
          <AppIcon.PlusCircle onPress={handleAddProduct} width={24} height={24} color={theme.colors.primary.DEFAULT} />
        {/* </TouchableOpacity> */}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab.key);
              setSearch('');
            }}
            activeOpacity={0.7}
          >
            <Text fontWeight={'semibold'} style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <AppIcon.Search width={18} height={18} color={theme.colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or SKUs..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      />
    </View>
  );
};
