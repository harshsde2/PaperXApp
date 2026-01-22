import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActiveRole } from '@shared/hooks/useActiveRole';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import type { PostRequirementOption, PostRequirementOptionConfig, UserRole } from '../types/postRequirement.types';
import { SCREENS } from '@navigation/constants';

// Role-specific options configuration
const DEALER_OPTIONS: PostRequirementOptionConfig[] = [
  {
    id: 'post-to-buy-material',
    title: 'Post to Buy',
    description: 'Paper & Board Raw Material/Ancillary Products',
  },
  {
    id: 'post-to-sell-material',
    title: 'Post to Sell',
    description: 'Paper & Board Raw Material/Ancillary Products',
  },
];

const CONVERTER_OPTIONS: PostRequirementOptionConfig[] = [
  {
    id: 'post-to-buy-material',
    title: 'Post to Buy',
    description: 'Raw Materials or Other Ancillary Products',
  },
  {
    id: 'post-to-sell-material',
    title: 'Post to Sell',
    description: 'Raw Materials or Other Ancillary Products',
  },
  {
    id: 'post-to-sell-machine',
    title: 'Post to Sell Machine',
    description: 'List your machine for sale',
  },
  {
    id: 'post-to-buy-machine',
    title: 'Post to Buy Machine',
    description: 'Find machines to purchase',
  },
  {
    id: 'post-to-find-jobwork',
    title: 'Post to Find Jobwork/Outsourcing',
    description: 'Textile, full machine capacity or during off-season',
  },
  {
    id: 'post-to-give-jobwork',
    title: 'Post to Give Jobwork',
    description: 'Outsourcing to complete an order',
  },
  {
    id: 'post-regular-product-design',
    title: 'Post Regular Product/Design',
    description: 'Ready to Dispatch section',
  },
];

const MACHINE_DEALER_OPTIONS: PostRequirementOptionConfig[] = [
  {
    id: 'post-to-sell-machine',
    title: 'Post to Sell Machine',
    description: 'List your machine for sale',
  },
  {
    id: 'post-to-buy-machine',
    title: 'Post to Buy Machine',
    description: 'Find machines to purchase',
  },
];

export const BRAND_OPTIONS: PostRequirementOptionConfig[] = [
  {
    id: 'post-to-post-requirement',
    title: 'Post Requirement',
    description: 'Post your packaging or product requirement',
  },
];

const getOptionsForRole = (role: UserRole): PostRequirementOptionConfig[] => {
  switch (role) {
    case 'dealer':
      return DEALER_OPTIONS;
    case 'converter':
      return CONVERTER_OPTIONS;
    case 'machine-dealer':
      return MACHINE_DEALER_OPTIONS;
    case 'brand':
      return BRAND_OPTIONS;
    default:
      return DEALER_OPTIONS;
  }
};

const PostRequirementOptionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // Use activeRole from Redux (supports role switching)
  const activeRole = useActiveRole();
  const options = getOptionsForRole(activeRole);

  console.log('options', options);

  const handleOptionPress = (option: PostRequirementOptionConfig) => {
    // Navigate to appropriate posting flow based on option.id
    if (option.id === 'post-to-buy-material') {
      navigation.navigate(SCREENS.MAIN.POST_TO_BUY as any, { intent: 'buy' });
    } else if (option.id === 'post-to-sell-material') {
      navigation.navigate(SCREENS.MAIN.POST_TO_BUY as any, { intent: 'sell' });
    } else if (option.id === 'post-to-post-requirement') {
      navigation.navigate(SCREENS.MAIN.POST_BRAND_REQUIREMENT as any);
    } else {
      // TODO: Add other posting screens as needed
      console.log('Selected option:', option.id);
    }
  };

  return (
    <ScreenWrapper
      backgroundColor="#F9FAFB"
      safeAreaEdges={['top']}
      scrollable
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AppIcon.ArrowLeft width={24} height={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Requirement</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>What would you like to post?</Text>
        <Text style={styles.sectionSubtitle}>
          Select an option to get started
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <AppIcon.ChevronRight width={20} height={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default PostRequirementOptionsScreen;
