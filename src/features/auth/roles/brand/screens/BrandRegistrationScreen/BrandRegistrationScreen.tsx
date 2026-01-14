import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { FloatingBottomContainer } from '@shared/components/FloatingBottomContainer';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import { useForm, FormInput, validationRules } from '@shared/forms';
import { useKeyboard, useFloatingBottomPadding } from '@shared/hooks';
import { useCompleteBrandProfile } from '@services/api';
import type { UpdateProfileResponse } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import { getFirstRegistrationScreen } from '@navigation/helpers';
import { ROLES } from '@utils/constants';
import { Alert, ActivityIndicator } from 'react-native';
import {
  BrandRegistrationScreenNavigationProp,
  BrandTypeCategory,
  BrandRegistrationFormData,
} from './@types';
import { createStyles } from './styles';
import { SCREENS } from '@navigation/constants';
import { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { LocationPicker } from '@shared/location';
import type { Location } from '@shared/location/types';

// Mapping from brand type string IDs to numeric IDs for API
// This should match your backend brand type IDs
const BRAND_TYPE_ID_MAP: Record<string, number> = {
  'food-beverage': 1,
  'packaged-food': 2,
  'snacks-confectionery': 3,
  dairy: 4,
  'frozen-food': 5,
  beverage: 6,
  'alcoholic-beverage': 7,
  'tobacco-nicotine': 8,
  pharmaceutical: 9,
  'otc-nutraceutical': 10,
  'ayurvedic-herbal': 11,
  'medical-device': 12,
  'diagnostic-kit': 13,
  'health-supplement': 14,
  cosmetics: 15,
  skincare: 16,
  haircare: 17,
  'perfume-fragrance': 18,
  'luxury-beauty': 19,
  grooming: 20,
  'apparel-clothing': 21,
  'garment-export': 22,
  footwear: 23,
  'fashion-accessories': 24,
  jewellery: 25,
  watch: 26,
  eyewear: 27,
  'consumer-electronics': 28,
  'mobile-accessories': 29,
  'electrical-appliances': 30,
  'home-appliances': 31,
  'it-hardware': 32,
  'industrial-electronics': 33,
  'd2c-consumer': 34,
  'ecommerce-seller': 35,
  'subscription-box': 36,
  'marketplace-private-label': 37,
  'quick-commerce': 38,
  bakery: 39,
  'patisserie-cake': 40,
  'qsr-fast-food': 41,
  'restaurant-chain': 42,
  'cloud-kitchen': 43,
  cafe: 44,
  catering: 45,
  'corporate-gifting': 46,
  'promotional-merchandise': 47,
  'office-supplies': 48,
  'industrial-goods': 49,
  chemical: 50,
  'paints-coatings': 51,
  'school-education': 52,
  'publishing-house': 53,
  'book-publisher': 54,
  edtech: 55,
  stationery: 56,
  'notebook-diary': 57,
  'agro-products': 58,
  seeds: 59,
  fertilizer: 60,
  'organic-natural': 61,
  'tea-coffee': 62,
  spices: 63,
  'home-furnishing': 64,
  furniture: 65,
  'home-decor': 66,
  kitchenware: 67,
  lighting: 68,
  'event-management': 69,
  'festive-gifting': 70,
  'wedding-gifting': 71,
  'luxury-hampers': 72,
  'promotional-campaign': 73,
};

// Brand Type Categories Data
const BRAND_TYPE_CATEGORIES: BrandTypeCategory[] = [
  {
    id: 'fmcg-consumer-goods',
    title: 'FMCG & CONSUMER GOODS',
    options: [
      {
        id: 'food-beverage',
        label: 'Food & Beverage Brand',
        category: 'fmcg-consumer-goods',
      },
      {
        id: 'packaged-food',
        label: 'Packaged Food Brand',
        category: 'fmcg-consumer-goods',
      },
      {
        id: 'snacks-confectionery',
        label: 'Snacks & Confectionery Brand',
        category: 'fmcg-consumer-goods',
      },
      { id: 'dairy', label: 'Dairy Brand', category: 'fmcg-consumer-goods' },
      {
        id: 'frozen-food',
        label: 'Frozen Food Brand',
        category: 'fmcg-consumer-goods',
      },
      {
        id: 'beverage',
        label: 'Beverage Brand (Juices, Water, Energy Drinks)',
        category: 'fmcg-consumer-goods',
      },
      {
        id: 'alcoholic-beverage',
        label: 'Alcoholic Beverage Brand',
        category: 'fmcg-consumer-goods',
      },
      {
        id: 'tobacco-nicotine',
        label: 'Tobacco / Nicotine Brand',
        category: 'fmcg-consumer-goods',
      },
    ],
  },
  {
    id: 'pharma-health-wellness',
    title: 'PHARMA, HEALTH & WELLNESS',
    options: [
      {
        id: 'pharmaceutical',
        label: 'Pharmaceutical Brand',
        category: 'pharma-health-wellness',
      },
      {
        id: 'otc-nutraceutical',
        label: 'OTC / Nutraceutical Brand',
        category: 'pharma-health-wellness',
      },
      {
        id: 'ayurvedic-herbal',
        label: 'Ayurvedic / Herbal Brand',
        category: 'pharma-health-wellness',
      },
      {
        id: 'medical-device',
        label: 'Medical Device Brand',
        category: 'pharma-health-wellness',
      },
      {
        id: 'diagnostic-kit',
        label: 'Diagnostic Kit Brand',
        category: 'pharma-health-wellness',
      },
      {
        id: 'health-supplement',
        label: 'Health Supplement Brand',
        category: 'pharma-health-wellness',
      },
    ],
  },
  {
    id: 'beauty-personal-care-luxury',
    title: 'BEAUTY, PERSONAL CARE & LUXURY',
    options: [
      {
        id: 'cosmetics',
        label: 'Cosmetics Brand',
        category: 'beauty-personal-care-luxury',
      },
      {
        id: 'skincare',
        label: 'Skincare Brand',
        category: 'beauty-personal-care-luxury',
      },
      {
        id: 'haircare',
        label: 'Haircare Brand',
        category: 'beauty-personal-care-luxury',
      },
      {
        id: 'perfume-fragrance',
        label: 'Perfume & Fragrance Brand',
        category: 'beauty-personal-care-luxury',
      },
      {
        id: 'luxury-beauty',
        label: 'Luxury Beauty Brand',
        category: 'beauty-personal-care-luxury',
      },
      {
        id: 'grooming',
        label: 'Grooming Brand',
        category: 'beauty-personal-care-luxury',
      },
    ],
  },
  {
    id: 'apparel-fashion-accessories',
    title: 'APPAREL, FASHION & ACCESSORIES',
    options: [
      {
        id: 'apparel-clothing',
        label: 'Apparel / Clothing Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'garment-export',
        label: 'Garment Export Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'footwear',
        label: 'Footwear Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'fashion-accessories',
        label: 'Fashion Accessories Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'jewellery',
        label: 'Jewellery Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'watch',
        label: 'Watch Brand',
        category: 'apparel-fashion-accessories',
      },
      {
        id: 'eyewear',
        label: 'Eyewear Brand',
        category: 'apparel-fashion-accessories',
      },
    ],
  },
  {
    id: 'electronics-durables',
    title: 'ELECTRONICS & DURABLES',
    options: [
      {
        id: 'consumer-electronics',
        label: 'Consumer Electronics Brand',
        category: 'electronics-durables',
      },
      {
        id: 'mobile-accessories',
        label: 'Mobile & Accessories Brand',
        category: 'electronics-durables',
      },
      {
        id: 'electrical-appliances',
        label: 'Electrical Appliances Brand',
        category: 'electronics-durables',
      },
      {
        id: 'home-appliances',
        label: 'Home Appliances Brand',
        category: 'electronics-durables',
      },
      {
        id: 'it-hardware',
        label: 'IT Hardware Brand',
        category: 'electronics-durables',
      },
      {
        id: 'industrial-electronics',
        label: 'Industrial Electronics Brand',
        category: 'electronics-durables',
      },
    ],
  },
  {
    id: 'ecommerce-d2c',
    title: 'E-COMMERCE & D2C BRANDS',
    options: [
      {
        id: 'd2c-consumer',
        label: 'D2C Consumer Brand',
        category: 'ecommerce-d2c',
      },
      {
        id: 'ecommerce-seller',
        label: 'E-commerce Seller Brand',
        category: 'ecommerce-d2c',
      },
      {
        id: 'subscription-box',
        label: 'Subscription Box Brand',
        category: 'ecommerce-d2c',
      },
      {
        id: 'marketplace-private-label',
        label: 'Marketplace Private Label',
        category: 'ecommerce-d2c',
      },
      {
        id: 'quick-commerce',
        label: 'Quick Commerce Brand',
        category: 'ecommerce-d2c',
      },
    ],
  },
  {
    id: 'food-service-hospitality',
    title: 'FOOD SERVICE & HOSPITALITY',
    options: [
      {
        id: 'bakery',
        label: 'Bakery Brand',
        category: 'food-service-hospitality',
      },
      {
        id: 'patisserie-cake',
        label: 'Patisserie / Cake Brand',
        category: 'food-service-hospitality',
      },
      {
        id: 'qsr-fast-food',
        label: 'QSR / Fast Food Brand',
        category: 'food-service-hospitality',
      },
      {
        id: 'restaurant-chain',
        label: 'Restaurant Chain',
        category: 'food-service-hospitality',
      },
      {
        id: 'cloud-kitchen',
        label: 'Cloud Kitchen',
        category: 'food-service-hospitality',
      },
      { id: 'cafe', label: 'Café Brand', category: 'food-service-hospitality' },
      {
        id: 'catering',
        label: 'Catering Brand',
        category: 'food-service-hospitality',
      },
    ],
  },
  {
    id: 'corporate-b2b-institutional',
    title: 'CORPORATE, B2B & INSTITUTIONAL',
    options: [
      {
        id: 'corporate-gifting',
        label: 'Corporate Gifting Brand',
        category: 'corporate-b2b-institutional',
      },
      {
        id: 'promotional-merchandise',
        label: 'Promotional Merchandise Brand',
        category: 'corporate-b2b-institutional',
      },
      {
        id: 'office-supplies',
        label: 'Office Supplies Brand',
        category: 'corporate-b2b-institutional',
      },
      {
        id: 'industrial-goods',
        label: 'Industrial Goods Brand',
        category: 'corporate-b2b-institutional',
      },
      {
        id: 'chemical',
        label: 'Chemical Brand',
        category: 'corporate-b2b-institutional',
      },
      {
        id: 'paints-coatings',
        label: 'Paints & Coatings Brand',
        category: 'corporate-b2b-institutional',
      },
    ],
  },
  {
    id: 'education-publishing-stationery',
    title: 'EDUCATION, PUBLISHING & STATIONERY',
    options: [
      {
        id: 'school-education',
        label: 'School / Education Brand',
        category: 'education-publishing-stationery',
      },
      {
        id: 'publishing-house',
        label: 'Publishing House',
        category: 'education-publishing-stationery',
      },
      {
        id: 'book-publisher',
        label: 'Book Publisher',
        category: 'education-publishing-stationery',
      },
      {
        id: 'edtech',
        label: 'EdTech Brand',
        category: 'education-publishing-stationery',
      },
      {
        id: 'stationery',
        label: 'Stationery Brand',
        category: 'education-publishing-stationery',
      },
      {
        id: 'notebook-diary',
        label: 'Notebook / Diary Brand',
        category: 'education-publishing-stationery',
      },
    ],
  },
  {
    id: 'agriculture-rural-products',
    title: 'AGRICULTURE & RURAL PRODUCTS',
    options: [
      {
        id: 'agro-products',
        label: 'Agro Products Brand',
        category: 'agriculture-rural-products',
      },
      {
        id: 'seeds',
        label: 'Seeds Brand',
        category: 'agriculture-rural-products',
      },
      {
        id: 'fertilizer',
        label: 'Fertilizer Brand',
        category: 'agriculture-rural-products',
      },
      {
        id: 'organic-natural',
        label: 'Organic / Natural Products Brand',
        category: 'agriculture-rural-products',
      },
      {
        id: 'tea-coffee',
        label: 'Tea / Coffee Brand',
        category: 'agriculture-rural-products',
      },
      {
        id: 'spices',
        label: 'Spices Brand',
        category: 'agriculture-rural-products',
      },
    ],
  },
  {
    id: 'home-lifestyle-decor',
    title: 'HOME, LIFESTYLE & DECOR',
    options: [
      {
        id: 'home-furnishing',
        label: 'Home Furnishing Brand',
        category: 'home-lifestyle-decor',
      },
      {
        id: 'furniture',
        label: 'Furniture Brand',
        category: 'home-lifestyle-decor',
      },
      {
        id: 'home-decor',
        label: 'Home Décor Brand',
        category: 'home-lifestyle-decor',
      },
      {
        id: 'kitchenware',
        label: 'Kitchenware Brand',
        category: 'home-lifestyle-decor',
      },
      {
        id: 'lighting',
        label: 'Lighting Brand',
        category: 'home-lifestyle-decor',
      },
    ],
  },
  {
    id: 'events-gifts-promotions',
    title: 'EVENTS, GIFTS & PROMOTIONS',
    options: [
      {
        id: 'event-management',
        label: 'Event Management Brand',
        category: 'events-gifts-promotions',
      },
      {
        id: 'festive-gifting',
        label: 'Festive Gifting Brand',
        category: 'events-gifts-promotions',
      },
      {
        id: 'wedding-gifting',
        label: 'Wedding Gifting Brand',
        category: 'events-gifts-promotions',
      },
      {
        id: 'luxury-hampers',
        label: 'Luxury Hampers Brand',
        category: 'events-gifts-promotions',
      },
      {
        id: 'promotional-campaign',
        label: 'Promotional Campaign Brand',
        category: 'events-gifts-promotions',
      },
    ],
  },
];

const BrandRegistrationScreen = () => {
  const navigation = useNavigation<BrandRegistrationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'BrandRegistration'>>();
  const theme = useTheme();
  const styles = createStyles(theme);

  // Get profileData from route params
  const { profileData } = route.params || {};

  // Keyboard visibility hook
  const { isKeyboardVisible } = useKeyboard();

  // API mutation hook
  const { mutate: completeBrandProfile, isPending: isSubmitting } =
    useCompleteBrandProfile();

  // Redux dispatch
  const dispatch = useAppDispatch();

  // Calculate bottom padding for scrollable content (to account for FloatingBottomContainer)
  // This ensures content doesn't get hidden behind the floating container
  const floatingContainerPadding = useFloatingBottomPadding({
    buttonHeight: 60,
    additionalContentHeight: 20, // Footer note text height
  });

  // Form handling
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BrandRegistrationFormData>({
    defaultValues: {
      companyName: '',
      brandName: '',
      brandTypes: [],
      contactPersonName: '',
      mobile: '',
      email: '',
      gstNumber: '',
      city: '',
      location: '',
      latitude: undefined,
      longitude: undefined,
    },
    mode: 'onChange', // Changed to onChange for real-time validation
  });

  // Watch form values
  const companyNameValue = watch('companyName');
  const brandNameValue = watch('brandName');
  const contactPersonNameValue = watch('contactPersonName');
  const mobileValue = watch('mobile');
  const emailValue = watch('email');
  const gstNumberValue = watch('gstNumber');
  const cityValue = watch('city');
  const locationValue = watch('location');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');
  const brandTypesValue = watch('brandTypes');

  // Local state for brand types selection
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<Set<string>>(
    new Set(),
  );

  // UI state
  const [showBrandTypeModal, setShowBrandTypeModal] = useState(false);
  const [brandTypeSearchQuery, setBrandTypeSearchQuery] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showManualLocationEntry, setShowManualLocationEntry] = useState(false);

  // Sync selectedBrandTypes with form value
  useEffect(() => {
    setValue('brandTypes', Array.from(selectedBrandTypes), {
      shouldValidate: true,
    });
  }, [selectedBrandTypes, setValue]);

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile: string) => {
    const cleaned = mobile.replace(/\D/g, ''); // Remove all non-digits
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(cleaned) && cleaned.length === 10;
  };

  const isMobileValid = useMemo(() => {
    if (!mobileValue?.trim()) return false;
    return isValidMobile(mobileValue);
  }, [mobileValue]);

  const isEmailValid = useMemo(() => {
    if (!emailValue?.trim()) return false;
    return isValidEmail(emailValue);
  }, [emailValue]);

  // Handle location selection from LocationPicker
  const handleLocationSelect = useCallback(
    (location: Location) => {
      setValue('location', location.address?.streetAddress || location.address?.formattedAddress || location.name || '', {
        shouldValidate: true,
      });
      setValue('city', location.address?.city || cityValue || '', {
        shouldValidate: true,
      });
      setValue('latitude', location.latitude, {
        shouldValidate: true,
      });
      setValue('longitude', location.longitude, {
        shouldValidate: true,
      });
      setShowLocationPicker(false);
      
      dispatch(
        showToast({
          message: 'Location selected successfully!',
          type: 'success',
        }),
      );
    },
    [setValue, cityValue, dispatch],
  );

  const isFormValid = useMemo(() => {
    const companyNameValid = companyNameValue?.trim().length > 0;
    const brandNameValid = brandNameValue?.trim().length > 0;
    const brandTypesValid = selectedBrandTypes.size > 0;
    const contactPersonValid = contactPersonNameValue?.trim().length > 0;
    const mobileValid = isMobileValid;
    const emailValid = isEmailValid;
    const cityValid = cityValue?.trim().length > 0;
    const locationValid = locationValue?.trim().length > 0;
    // Coordinates are required if location was selected from map, optional if manually entered
    const coordinatesValid = showManualLocationEntry 
      ? true 
      : latitudeValue !== undefined && longitudeValue !== undefined;

    const valid =
      companyNameValid &&
      brandNameValid &&
      brandTypesValid &&
      contactPersonValid &&
      mobileValid &&
      emailValid &&
      cityValid &&
      locationValid &&
      coordinatesValid;

    // Debug log (remove in production)
    if (__DEV__) {
      console.log('Form Validation:', {
        companyName: companyNameValid,
        brandName: brandNameValid,
        brandTypes: brandTypesValid,
        contactPerson: contactPersonValid,
        mobile: mobileValid,
        email: emailValid,
        city: cityValid,
        location: locationValid,
        coordinates: coordinatesValid,
        manualEntry: showManualLocationEntry,
        overall: valid,
      });
    }

    return valid;
  }, [
    companyNameValue,
    brandNameValue,
    selectedBrandTypes.size,
    contactPersonNameValue,
    isMobileValid,
    isEmailValid,
    cityValue,
    locationValue,
    latitudeValue,
    longitudeValue,
    showManualLocationEntry,
  ]);

  // Filtered brand types based on search
  const filteredBrandTypes = useMemo(() => {
    if (!brandTypeSearchQuery.trim()) {
      return BRAND_TYPE_CATEGORIES;
    }

    const query = brandTypeSearchQuery.toLowerCase();
    return BRAND_TYPE_CATEGORIES.map(category => ({
      ...category,
      options: category.options.filter(
        option =>
          option.label.toLowerCase().includes(query) ||
          category.title.toLowerCase().includes(query),
      ),
    })).filter(
      category =>
        category.options.length > 0 ||
        category.title.toLowerCase().includes(query),
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

  const onSubmit = useCallback(
    (data: BrandRegistrationFormData) => {
      // Validate that at least one brand type is selected
      if (selectedBrandTypes.size === 0) {
        Alert.alert(
          'Validation Error',
          'Please select at least one brand type',
        );
        return;
      }

      // Convert brand type string IDs to numeric IDs for API
      const brandTypeIds = Array.from(selectedBrandTypes)
        .map(id => BRAND_TYPE_ID_MAP[id])
        .filter((id): id is number => id !== undefined && !isNaN(id));

      if (brandTypeIds.length === 0) {
        Alert.alert(
          'Validation Error',
          'Please select at least one valid brand type',
        );
        return;
      }

      // Prepare API request data
      const apiData = {
        company_name:
          companyNameValue?.trim() || profileData?.company_name || '',
        brand_name: brandNameValue?.trim() || profileData?.brand_name || '',
        contact_person_name: contactPersonNameValue?.trim() || '',
        mobile: mobileValue?.replace(/\D/g, '') || profileData?.mobile || '',
        email: emailValue?.trim() || profileData?.email || '',
        gst: gstNumberValue?.trim() || profileData?.gst_in || undefined,
        city: cityValue?.trim() || profileData?.city || '',
        location: locationValue?.trim() || profileData?.location || '',
        latitude: latitudeValue || profileData?.latitude || 28.6139,
        longitude: longitudeValue || profileData?.longitude || 77.209,
        brand_type_ids: brandTypeIds,
      };

      console.log('API Data:', JSON.stringify(apiData, null, 2));

      // Call API
      completeBrandProfile(apiData, {
        onSuccess: (response: any) => {
          dispatch(
            showToast({
              message:
                response.message ||
                'Brand registration completed successfully!',
              type: 'success',
            }),
          );

          const updatedProfileData: UpdateProfileResponse = {
            ...profileData,
            ...response.brand,
          };

          const isSecondaryRoleCompletion =
            profileData?.secondary_role === ROLES.BRAND;

          if (isSecondaryRoleCompletion) {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: updatedProfileData,
            });
          } else if (
            updatedProfileData.has_secondary_role === 1 &&
            updatedProfileData.secondary_role
          ) {
            const secondaryRole =
              updatedProfileData.secondary_role as (typeof ROLES)[keyof typeof ROLES];
            const firstSecondaryScreen =
              getFirstRegistrationScreen(secondaryRole);

            if (
              firstSecondaryScreen &&
              firstSecondaryScreen !== SCREENS.AUTH.VERIFICATION_STATUS
            ) {
              (navigation.navigate as any)(firstSecondaryScreen, {
                profileData: updatedProfileData,
              });
            } else {
              navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
                profileData: updatedProfileData,
              });
            }
          } else {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: updatedProfileData,
            });
          }
        },
        onError: (error: any) => {
          console.error('Brand profile completion error:', error);
          let errorMessage =
            'Failed to complete registration. Please try again.';
          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          dispatch(
            showToast({
              message: errorMessage,
              type: 'error',
            }),
          );

          const isSecondaryRoleCompletion =
            profileData?.secondary_role === ROLES.BRAND;

          if (isSecondaryRoleCompletion) {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: profileData,
            });
          } else if (
            profileData?.has_secondary_role === 1 &&
            profileData?.secondary_role
          ) {
            const secondaryRole =
              profileData.secondary_role as (typeof ROLES)[keyof typeof ROLES];
            const firstSecondaryScreen =
              getFirstRegistrationScreen(secondaryRole);

            if (
              firstSecondaryScreen &&
              firstSecondaryScreen !== SCREENS.AUTH.VERIFICATION_STATUS
            ) {
              (navigation.navigate as any)(firstSecondaryScreen, {
                profileData: profileData,
              });
            } else {
              navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
                profileData: profileData,
              });
            }
          } else {
            navigation.navigate(SCREENS.AUTH.VERIFICATION_STATUS, {
              profileData: profileData,
            });
          }
        },
      });
    },
    [
      selectedBrandTypes,
      companyNameValue,
      brandNameValue,
      contactPersonNameValue,
      mobileValue,
      emailValue,
      gstNumberValue,
      cityValue,
      locationValue,
      latitudeValue,
      longitudeValue,
      isValidEmail,
      isValidMobile,
      completeBrandProfile,
      navigation,
      profileData,
      dispatch,
    ],
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        enabled={Platform.OS === 'ios'}
      >
        <ScreenWrapper
          scrollable
          backgroundColor={theme.colors.background.secondary}
          safeAreaEdges={[]}
          contentContainerStyle={{
            paddingBottom: floatingContainerPadding,
          }}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'handled',
            keyboardDismissMode: 'interactive',
          }}
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
              {/* Company Name */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Company Name
                </Text>
                <Controller
                  control={control}
                  name="companyName"
                  rules={
                    validationRules.required('Please enter company name') as any
                  }
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'companyName' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="e.g. ABC Brands Pvt Ltd"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('companyName')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                        />
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Brand Name */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Brand Name
                </Text>
                <Controller
                  control={control}
                  name="brandName"
                  rules={
                    validationRules.required('Please enter brand name') as any
                  }
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'brandName' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="e.g. ABC Premium"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('brandName')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                        />
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Brand Type(s) */}
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="brandTypes"
                  rules={
                    {
                      required: 'Please select at least one brand type',
                      validate: (value: string[]) => {
                        return (
                          (value && value.length > 0) ||
                          'Please select at least one brand type'
                        );
                      },
                    } as any
                  }
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <Text
                        variant="bodyMedium"
                        fontWeight="medium"
                        style={styles.label}
                      >
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
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Contact Person Name */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Contact Person Name
                </Text>
                <Controller
                  control={control}
                  name="contactPersonName"
                  rules={
                    validationRules.required(
                      'Please enter contact person name',
                    ) as any
                  }
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'contactPerson' &&
                            styles.inputWrapperFocused,
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
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('contactPerson')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                        />
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Mobile Number */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Mobile Number
                </Text>
                <Controller
                  control={control}
                  name="mobile"
                  rules={
                    {
                      required: 'Please enter mobile number',
                      validate: (value: string) => {
                        if (!value?.trim())
                          return 'Please enter mobile number';
                        return (
                          isValidMobile(value) ||
                          'Please enter a valid mobile number'
                        );
                      },
                    } as any
                  }
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'mobile' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="Enter mobile number"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('mobile')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                          keyboardType="phone-pad"
                          maxLength={10}
                        />
                        {isMobileValid && (
                          <View style={styles.validationIcon}>
                            <AppIcon.TickCheckedBox
                              width={20}
                              height={20}
                              color={
                                (theme.colors.success as any)?.DEFAULT ||
                                theme.colors.primary.DEFAULT
                              }
                            />
                          </View>
                        )}
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Email
                </Text>
                <Controller
                  control={control}
                  name="email"
                  rules={
                    {
                      required: 'Please enter email',
                      validate: (value: string) => {
                        if (!value?.trim())
                          return 'Please enter email';
                        return (
                          isValidEmail(value) ||
                          'Please enter a valid email address'
                        );
                      },
                    } as any
                  }
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'email' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="Enter email address"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('email')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        {isEmailValid && (
                          <View style={styles.validationIcon}>
                            <AppIcon.TickCheckedBox
                              width={20}
                              height={20}
                              color={
                                (theme.colors.success as any)?.DEFAULT ||
                                theme.colors.primary.DEFAULT
                              }
                            />
                          </View>
                        )}
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* GST Number (Optional) */}
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing[1],
                  }}
                >
                  <Text
                    variant="bodyMedium"
                    fontWeight="medium"
                    style={styles.label}
                  >
                    GST Number
                  </Text>
                  <Text variant="captionSmall" style={styles.optionalLabel}>
                    (Optional)
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="gstNumber"
                  rules={validationRules.gstin() as any}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'gstNumber' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <TextInput
                          style={styles.input}
                          placeholder="15-DIGIT ID."
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('gstNumber')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                          maxLength={15}
                        />
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* City */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  City
                </Text>
                <Controller
                  control={control}
                  name="city"
                  rules={validationRules.required('Please enter city') as any}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
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
                          placeholder="Enter city"
                          placeholderTextColor={theme.colors.text.tertiary}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedInput('city')}
                          onBlur={() => {
                            onBlur();
                            setFocusedInput(null);
                          }}
                        />
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Location */}
              <View style={styles.inputContainer}>
                <Text
                  variant="bodyMedium"
                  fontWeight="medium"
                  style={styles.label}
                >
                  Location
                </Text>
                <Controller
                  control={control}
                  name="location"
                  rules={validationRules.required('Please select or enter location') as any}
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === 'location' &&
                            styles.inputWrapperFocused,
                        ]}
                      >
                        <View style={styles.inputIconLeft}>
                          <AppIcon.Location
                            width={20}
                            height={20}
                            color={theme.colors.text.tertiary}
                          />
                        </View>
                        {showManualLocationEntry ? (
                          <TextInput
                            style={styles.input}
                            placeholder="Enter location manually"
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={value}
                            onChangeText={(text) => {
                              setValue('location', text, { shouldValidate: true });
                            }}
                            onFocus={() => setFocusedInput('location')}
                            onBlur={() => {
                              setFocusedInput(null);
                            }}
                          />
                        ) : (
                          <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center' }}
                            onPress={() => setShowLocationPicker(true)}
                            activeOpacity={0.7}
                          >
                            <Text
                              variant="bodyMedium"
                              style={[
                                !value
                                  ? { color: theme.colors.text.tertiary }
                                  : { color: theme.colors.text.primary },
                              ]}
                            >
                              {value || 'Select location on map'}
                            </Text>
                          </TouchableOpacity>
                        )}
                        <View style={styles.inputIconRight}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowManualLocationEntry(!showManualLocationEntry);
                              if (!showManualLocationEntry) {
                                setValue('location', '', { shouldValidate: true });
                                setValue('latitude', undefined, { shouldValidate: true });
                                setValue('longitude', undefined, { shouldValidate: true });
                              }
                            }}
                            activeOpacity={0.7}
                          >
                            <AppIcon.Search
                              width={20}
                              height={20}
                              color={theme.colors.text.tertiary}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {error && (
                        <Text
                          variant="captionSmall"
                          style={{
                            color:
                              (theme.colors.error as any)?.DEFAULT || '#FF3B30',
                            marginTop: 4,
                          }}
                        >
                          {error.message}
                        </Text>
                      )}
                      {!showManualLocationEntry && (
                        <TouchableOpacity
                          onPress={() => setShowLocationPicker(true)}
                          style={{
                            marginTop: theme.spacing[2],
                            padding: theme.spacing[2],
                            backgroundColor: theme.colors.primary.DEFAULT,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}
                          activeOpacity={0.8}
                        >
                          <Text
                            variant="bodyMedium"
                            style={{ color: theme.colors.text.inverse }}
                          >
                            {value ? 'Change Location on Map' : 'Select Location on Map'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                />
              </View>
            </View>
          </View>

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
                  <Text
                    variant="h5"
                    fontWeight="bold"
                    style={styles.brandTypeModalTitle}
                  >
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
                    <Text
                      variant="bodyMedium"
                      fontWeight="semibold"
                      color={theme.colors.primary.DEFAULT}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedBrandTypes.size > 0 && (
                  <View style={styles.selectedCountBadge}>
                    <Text
                      variant="captionSmall"
                      style={styles.selectedCountText}
                    >
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
                  {filteredBrandTypes.map(category => (
                    <View key={category.id} style={styles.brandTypeCategory}>
                      <Text
                        variant="captionMedium"
                        style={styles.brandTypeCategoryTitle}
                      >
                        {category.title}
                      </Text>
                      {category.options.map(option => {
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

          {/* Location Picker Modal */}
          <Modal
            visible={showLocationPicker}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setShowLocationPicker(false)}
          >
            <LocationPicker
              initialLocation={
                latitudeValue && longitudeValue
                  ? {
                      latitude: latitudeValue,
                      longitude: longitudeValue,
                      address: {
                        formattedAddress: locationValue || '',
                        streetAddress: locationValue || '',
                      },
                    }
                  : undefined
              }
              onLocationSelect={handleLocationSelect}
              onCancel={() => setShowLocationPicker(false)}
              allowMapTap={true}
              confirmButtonText="Confirm Location"
              title="Select Location"
            />
          </Modal>
        </ScreenWrapper>
      </KeyboardAvoidingView>

      {/* Floating Bottom Container - Hidden when keyboard is open */}
      {!isKeyboardVisible && (
        <FloatingBottomContainer
          backgroundColor={theme.colors.background.primary}
          paddingHorizontal={theme.spacing[4]}
          paddingVertical={theme.spacing[4]}
          shadow={true}
          borderRadius={0}
          style={{
            gap: theme.spacing[2],
          }}
        >
          <Text variant="bodySmall" style={styles.footerNote}>
            You can add more details later while posting a requirement.
          </Text>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isFormValid || isSubmitting) && styles.continueButtonDisabled,
            ]}
            onPress={() => {
              if (isFormValid && !isSubmitting) {
                handleSubmit(onSubmit)();
              } else {
                // Debug: Log why button is disabled
                if (__DEV__) {
                  console.log('Button disabled. Form state:', {
                    companyName: companyNameValue,
                    brandName: brandNameValue,
                    brandTypes: selectedBrandTypes.size,
                    contactPerson: contactPersonNameValue,
                    mobile: mobileValue,
                    email: emailValue,
                    city: cityValue,
                    location: locationValue,
                    latitude: latitudeValue,
                    longitude: longitudeValue,
                    isMobileValid,
                    isEmailValid,
                    isFormValid,
                    isSubmitting,
                  });
                }
              }
            }}
            activeOpacity={0.8}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color={theme.colors.text.inverse}
                size="small"
              />
            ) : (
              <>
                <Text
                  variant="buttonMedium"
                  style={[
                    styles.continueButtonText,
                    {
                      color: !isFormValid
                        ? theme.colors.text.primary
                        : theme.colors.text.inverse,
                    },
                  ]}
                >
                  Continue
                </Text>
                <AppIcon.ArrowRight
                  width={20}
                  height={20}
                  color={theme.colors.text.inverse}
                />
              </>
            )}
          </TouchableOpacity>
        </FloatingBottomContainer>
      )}
    </>
  );
};

export default BrandRegistrationScreen;
