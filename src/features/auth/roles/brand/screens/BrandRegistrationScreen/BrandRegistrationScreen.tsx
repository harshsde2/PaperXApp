import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { CustomHeader } from '@shared/components/CustomHeader';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { BrandRegistrationScreenNavigationProp, BrandTypeCategory } from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';

// Brand Type Categories Data
const BRAND_TYPE_CATEGORIES: BrandTypeCategory[] = [
  {
    id: 'fmcg-consumer-goods',
    title: 'FMCG & CONSUMER GOODS',
    options: [
      { id: 'food-beverage', label: 'Food & Beverage Brand', category: 'fmcg-consumer-goods' },
      { id: 'packaged-food', label: 'Packaged Food Brand', category: 'fmcg-consumer-goods' },
      { id: 'snacks-confectionery', label: 'Snacks & Confectionery Brand', category: 'fmcg-consumer-goods' },
      { id: 'dairy', label: 'Dairy Brand', category: 'fmcg-consumer-goods' },
      { id: 'frozen-food', label: 'Frozen Food Brand', category: 'fmcg-consumer-goods' },
      { id: 'beverage', label: 'Beverage Brand (Juices, Water, Energy Drinks)', category: 'fmcg-consumer-goods' },
      { id: 'alcoholic-beverage', label: 'Alcoholic Beverage Brand', category: 'fmcg-consumer-goods' },
      { id: 'tobacco-nicotine', label: 'Tobacco / Nicotine Brand', category: 'fmcg-consumer-goods' },
    ],
  },
  {
    id: 'pharma-health-wellness',
    title: 'PHARMA, HEALTH & WELLNESS',
    options: [
      { id: 'pharmaceutical', label: 'Pharmaceutical Brand', category: 'pharma-health-wellness' },
      { id: 'otc-nutraceutical', label: 'OTC / Nutraceutical Brand', category: 'pharma-health-wellness' },
      { id: 'ayurvedic-herbal', label: 'Ayurvedic / Herbal Brand', category: 'pharma-health-wellness' },
      { id: 'medical-device', label: 'Medical Device Brand', category: 'pharma-health-wellness' },
      { id: 'diagnostic-kit', label: 'Diagnostic Kit Brand', category: 'pharma-health-wellness' },
      { id: 'health-supplement', label: 'Health Supplement Brand', category: 'pharma-health-wellness' },
    ],
  },
  {
    id: 'beauty-personal-care-luxury',
    title: 'BEAUTY, PERSONAL CARE & LUXURY',
    options: [
      { id: 'cosmetics', label: 'Cosmetics Brand', category: 'beauty-personal-care-luxury' },
      { id: 'skincare', label: 'Skincare Brand', category: 'beauty-personal-care-luxury' },
      { id: 'haircare', label: 'Haircare Brand', category: 'beauty-personal-care-luxury' },
      { id: 'perfume-fragrance', label: 'Perfume & Fragrance Brand', category: 'beauty-personal-care-luxury' },
      { id: 'luxury-beauty', label: 'Luxury Beauty Brand', category: 'beauty-personal-care-luxury' },
      { id: 'grooming', label: 'Grooming Brand', category: 'beauty-personal-care-luxury' },
    ],
  },
  {
    id: 'apparel-fashion-accessories',
    title: 'APPAREL, FASHION & ACCESSORIES',
    options: [
      { id: 'apparel-clothing', label: 'Apparel / Clothing Brand', category: 'apparel-fashion-accessories' },
      { id: 'garment-export', label: 'Garment Export Brand', category: 'apparel-fashion-accessories' },
      { id: 'footwear', label: 'Footwear Brand', category: 'apparel-fashion-accessories' },
      { id: 'fashion-accessories', label: 'Fashion Accessories Brand', category: 'apparel-fashion-accessories' },
      { id: 'jewellery', label: 'Jewellery Brand', category: 'apparel-fashion-accessories' },
      { id: 'watch', label: 'Watch Brand', category: 'apparel-fashion-accessories' },
      { id: 'eyewear', label: 'Eyewear Brand', category: 'apparel-fashion-accessories' },
    ],
  },
  {
    id: 'electronics-durables',
    title: 'ELECTRONICS & DURABLES',
    options: [
      { id: 'consumer-electronics', label: 'Consumer Electronics Brand', category: 'electronics-durables' },
      { id: 'mobile-accessories', label: 'Mobile & Accessories Brand', category: 'electronics-durables' },
      { id: 'electrical-appliances', label: 'Electrical Appliances Brand', category: 'electronics-durables' },
      { id: 'home-appliances', label: 'Home Appliances Brand', category: 'electronics-durables' },
      { id: 'it-hardware', label: 'IT Hardware Brand', category: 'electronics-durables' },
      { id: 'industrial-electronics', label: 'Industrial Electronics Brand', category: 'electronics-durables' },
    ],
  },
  {
    id: 'ecommerce-d2c',
    title: 'E-COMMERCE & D2C BRANDS',
    options: [
      { id: 'd2c-consumer', label: 'D2C Consumer Brand', category: 'ecommerce-d2c' },
      { id: 'ecommerce-seller', label: 'E-commerce Seller Brand', category: 'ecommerce-d2c' },
      { id: 'subscription-box', label: 'Subscription Box Brand', category: 'ecommerce-d2c' },
      { id: 'marketplace-private-label', label: 'Marketplace Private Label', category: 'ecommerce-d2c' },
      { id: 'quick-commerce', label: 'Quick Commerce Brand', category: 'ecommerce-d2c' },
    ],
  },
  {
    id: 'food-service-hospitality',
    title: 'FOOD SERVICE & HOSPITALITY',
    options: [
      { id: 'bakery', label: 'Bakery Brand', category: 'food-service-hospitality' },
      { id: 'patisserie-cake', label: 'Patisserie / Cake Brand', category: 'food-service-hospitality' },
      { id: 'qsr-fast-food', label: 'QSR / Fast Food Brand', category: 'food-service-hospitality' },
      { id: 'restaurant-chain', label: 'Restaurant Chain', category: 'food-service-hospitality' },
      { id: 'cloud-kitchen', label: 'Cloud Kitchen', category: 'food-service-hospitality' },
      { id: 'cafe', label: 'Café Brand', category: 'food-service-hospitality' },
      { id: 'catering', label: 'Catering Brand', category: 'food-service-hospitality' },
    ],
  },
  {
    id: 'corporate-b2b-institutional',
    title: 'CORPORATE, B2B & INSTITUTIONAL',
    options: [
      { id: 'corporate-gifting', label: 'Corporate Gifting Brand', category: 'corporate-b2b-institutional' },
      { id: 'promotional-merchandise', label: 'Promotional Merchandise Brand', category: 'corporate-b2b-institutional' },
      { id: 'office-supplies', label: 'Office Supplies Brand', category: 'corporate-b2b-institutional' },
      { id: 'industrial-goods', label: 'Industrial Goods Brand', category: 'corporate-b2b-institutional' },
      { id: 'chemical', label: 'Chemical Brand', category: 'corporate-b2b-institutional' },
      { id: 'paints-coatings', label: 'Paints & Coatings Brand', category: 'corporate-b2b-institutional' },
    ],
  },
  {
    id: 'education-publishing-stationery',
    title: 'EDUCATION, PUBLISHING & STATIONERY',
    options: [
      { id: 'school-education', label: 'School / Education Brand', category: 'education-publishing-stationery' },
      { id: 'publishing-house', label: 'Publishing House', category: 'education-publishing-stationery' },
      { id: 'book-publisher', label: 'Book Publisher', category: 'education-publishing-stationery' },
      { id: 'edtech', label: 'EdTech Brand', category: 'education-publishing-stationery' },
      { id: 'stationery', label: 'Stationery Brand', category: 'education-publishing-stationery' },
      { id: 'notebook-diary', label: 'Notebook / Diary Brand', category: 'education-publishing-stationery' },
    ],
  },
  {
    id: 'agriculture-rural-products',
    title: 'AGRICULTURE & RURAL PRODUCTS',
    options: [
      { id: 'agro-products', label: 'Agro Products Brand', category: 'agriculture-rural-products' },
      { id: 'seeds', label: 'Seeds Brand', category: 'agriculture-rural-products' },
      { id: 'fertilizer', label: 'Fertilizer Brand', category: 'agriculture-rural-products' },
      { id: 'organic-natural', label: 'Organic / Natural Products Brand', category: 'agriculture-rural-products' },
      { id: 'tea-coffee', label: 'Tea / Coffee Brand', category: 'agriculture-rural-products' },
      { id: 'spices', label: 'Spices Brand', category: 'agriculture-rural-products' },
    ],
  },
  {
    id: 'home-lifestyle-decor',
    title: 'HOME, LIFESTYLE & DECOR',
    options: [
      { id: 'home-furnishing', label: 'Home Furnishing Brand', category: 'home-lifestyle-decor' },
      { id: 'furniture', label: 'Furniture Brand', category: 'home-lifestyle-decor' },
      { id: 'home-decor', label: 'Home Décor Brand', category: 'home-lifestyle-decor' },
      { id: 'kitchenware', label: 'Kitchenware Brand', category: 'home-lifestyle-decor' },
      { id: 'lighting', label: 'Lighting Brand', category: 'home-lifestyle-decor' },
    ],
  },
  {
    id: 'events-gifts-promotions',
    title: 'EVENTS, GIFTS & PROMOTIONS',
    options: [
      { id: 'event-management', label: 'Event Management Brand', category: 'events-gifts-promotions' },
      { id: 'festive-gifting', label: 'Festive Gifting Brand', category: 'events-gifts-promotions' },
      { id: 'wedding-gifting', label: 'Wedding Gifting Brand', category: 'events-gifts-promotions' },
      { id: 'luxury-hampers', label: 'Luxury Hampers Brand', category: 'events-gifts-promotions' },
      { id: 'promotional-campaign', label: 'Promotional Campaign Brand', category: 'events-gifts-promotions' },
    ],
  },
];

const BrandRegistrationScreen = () => {
  const navigation = useNavigation<BrandRegistrationScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<Set<string>>(new Set());
  const [contactPersonName, setContactPersonName] = useState('');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('');

  // UI state
  const [showBrandTypeModal, setShowBrandTypeModal] = useState(false);
  const [brandTypeSearchQuery, setBrandTypeSearchQuery] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
  };

  const isMobileOrEmailValid = useMemo(() => {
    if (!mobileOrEmail.trim()) return false;
    return isValidEmail(mobileOrEmail) || isValidMobile(mobileOrEmail);
  }, [mobileOrEmail]);

  const isFormValid = useMemo(() => {
    return (
      companyName.trim().length > 0 &&
      selectedBrandTypes.size > 0 &&
      contactPersonName.trim().length > 0 &&
      isMobileOrEmailValid &&
      city.trim().length > 0
    );
  }, [companyName, selectedBrandTypes.size, contactPersonName, isMobileOrEmailValid, city]);

  // Filtered brand types based on search
  const filteredBrandTypes = useMemo(() => {
    if (!brandTypeSearchQuery.trim()) {
      return BRAND_TYPE_CATEGORIES;
    }

    const query = brandTypeSearchQuery.toLowerCase();
    return BRAND_TYPE_CATEGORIES.map(category => ({
      ...category,
      options: category.options.filter(option =>
        option.label.toLowerCase().includes(query) ||
        category.title.toLowerCase().includes(query)
      ),
    })).filter(category =>
      category.options.length > 0 || category.title.toLowerCase().includes(query)
    );
  }, [brandTypeSearchQuery]);

  // Get selected brand type labels
  const selectedBrandTypeLabels = useMemo(() => {
    const allOptions = BRAND_TYPE_CATEGORIES.flatMap(cat => cat.options);
    return Array.from(selectedBrandTypes)
      .map(id => allOptions.find(opt => opt.id === id)?.label)
      .filter(Boolean) as string[];
  }, [selectedBrandTypes]);

  const toggleBrandType = (optionId: string) => {
    const newSelected = new Set(selectedBrandTypes);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedBrandTypes(newSelected);
  };

  const handleContinue = () => {
    if (!isFormValid) return;

    // TODO: Save form data and navigate to next screen
    // navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS);
    console.log('Form data:', {
      companyName,
      brandTypes: Array.from(selectedBrandTypes),
      contactPersonName,
      mobileOrEmail,
      gstNumber,
      city,
    });
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.colors.background.secondary}
      safeAreaEdges={[]}
      contentContainerStyle={styles.scrollContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text variant="h3" fontWeight="bold" style={styles.title}>
              Register Your Brand
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Join the premium network for packaging professionals.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Company / Brand Name */}
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Company / Brand Name
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'companyName' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Acme Packaging Ltd."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={companyName}
                  onChangeText={setCompanyName}
                  onFocus={() => setFocusedInput('companyName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Brand Type(s) */}
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Brand Type(s)
              </Text>
              <TouchableOpacity
                style={styles.brandTypeSelector}
                onPress={() => setShowBrandTypeModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.brandTypeSelectorText,
                    selectedBrandTypes.size === 0
                      ? styles.brandTypeSelectorPlaceholder
                      : styles.brandTypeSelectorSelected,
                  ]}
                  numberOfLines={1}
                >
                  {selectedBrandTypes.size === 0
                    ? 'Select relevant categories.'
                    : `${selectedBrandTypes.size} selected`}
                </Text>
                <AppIcon.ChevronDown
                  width={20}
                  height={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            {/* Contact Person Name */}
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Contact Person Name
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'contactPerson' && styles.inputWrapperFocused,
                ]}
              >
                <View style={styles.inputIconLeft}>
                  <AppIcon.Person
                    width={20}
                    height={20}
                    color={theme.colors.text.tertiary}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={contactPersonName}
                  onChangeText={setContactPersonName}
                  onFocus={() => setFocusedInput('contactPerson')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Mobile Number OR Email */}
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                Mobile Number OR Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'mobileOrEmail' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile or email"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={mobileOrEmail}
                  onChangeText={setMobileOrEmail}
                  onFocus={() => setFocusedInput('mobileOrEmail')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isMobileOrEmailValid && (
                  <View style={styles.validationIcon}>
                    <AppIcon.TickCheckedBox
                      width={20}
                      height={20}
                      color={theme.colors.success || theme.colors.primary.DEFAULT}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* GST Number (Optional) */}
            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] }}>
                <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                  GST Number
                </Text>
                <Text variant="captionSmall" style={styles.optionalLabel}>
                  (Optional)
                </Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'gstNumber' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="15-DIGIT ID."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={gstNumber}
                  onChangeText={setGstNumber}
                  onFocus={() => setFocusedInput('gstNumber')}
                  onBlur={() => setFocusedInput(null)}
                  maxLength={15}
                />
              </View>
            </View>

            {/* City / Location */}
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
                City / Location
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'city' && styles.inputWrapperFocused,
                ]}
              >
                <View style={styles.inputIconLeft}>
                  <AppIcon.Location
                    width={20}
                    height={20}
                    color={theme.colors.text.tertiary}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Search city."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={city}
                  onChangeText={setCity}
                  onFocus={() => setFocusedInput('city')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputIconRight}>
                  <AppIcon.Search
                    width={20}
                    height={20}
                    color={theme.colors.text.tertiary}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Brand Type Selection Modal */}
      <Modal
        visible={showBrandTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBrandTypeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View style={styles.brandTypeModal}>
            <View style={styles.brandTypeModalHeader}>
              <Text variant="h5" fontWeight="bold" style={styles.brandTypeModalTitle}>
                Select Brand Type(s)
              </Text>
              <TouchableOpacity
                style={styles.brandTypeModalClose}
                onPress={() => {
                  setShowBrandTypeModal(false);
                  setBrandTypeSearchQuery('');
                }}
                activeOpacity={0.7}
              >
                <Text variant="bodyMedium" fontWeight="semibold" color={theme.colors.primary.DEFAULT}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {selectedBrandTypes.size > 0 && (
              <View style={styles.selectedCountBadge}>
                <Text variant="captionSmall" style={styles.selectedCountText}>
                  {selectedBrandTypes.size} Selected
                </Text>
              </View>
            )}

            <View style={styles.brandTypeSearchContainer}>
              <View style={styles.brandTypeSearchIcon}>
                <AppIcon.Search
                  width={20}
                  height={20}
                  color={theme.colors.text.tertiary}
                />
              </View>
              <TextInput
                style={styles.brandTypeSearchInput}
                placeholder="Search brand types..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={brandTypeSearchQuery}
                onChangeText={setBrandTypeSearchQuery}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredBrandTypes.map((category) => (
                <View key={category.id} style={styles.brandTypeCategory}>
                  <Text variant="captionMedium" style={styles.brandTypeCategoryTitle}>
                    {category.title}
                  </Text>
                  {category.options.map((option) => {
                    const isSelected = selectedBrandTypes.has(option.id);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.brandTypeOption}
                        onPress={() => toggleBrandType(option.id)}
                        activeOpacity={0.7}
                      >
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
                            color={theme.colors.border.primary}
                          />
                        )}
                        <Text
                          variant="bodyMedium"
                          style={[
                            styles.brandTypeOptionLabel,
                            isSelected && styles.brandTypeOptionSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerNote}>
          You can add more details later while posting a requirement.
        </Text>
        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!isFormValid}
        >
          <Text variant="buttonMedium" style={styles.continueButtonText}>
            Continue
          </Text>
          <AppIcon.ArrowRight
            width={20}
            height={20}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default BrandRegistrationScreen;

