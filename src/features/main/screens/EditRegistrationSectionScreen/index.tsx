/**
 * EditRegistrationSectionScreen
 * Focused, standalone editor for ONE Registration Details section. The section's
 * `editKey` selects an editor archetype (multi-select list, address, capacity,
 * common fields). Saving posts only that section's fields to the role's merge
 * endpoint (partial update), which re-runs matchmaking server-side.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { CustomButton } from '@shared/components/CustomButton';
import { DropdownButton } from '@shared/components/DropdownButton';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { MultiSelectBottomSheetContent } from '@shared/components/MultiSelectBottomSheetContent';
import { StructuredAddressFormModal } from '@shared/components/StructuredAddressFormModal';
import type { WarehouseFormMapData } from '@shared/components/WarehouseAddressForm/@types';
import { AppIcon } from '@assets/svgs';
import { LOCATION_FALLBACK_COORDINATES } from '@shared/constants/config';
import { useUpdateProfileSection } from '@services/api';
import { useAppDispatch } from '@store/hooks';
import { showToast } from '@store/slices/uiSlice';
import type { MainStackParamList } from '@navigation/MainNavigator';
import type { Theme } from '@theme/types';
import { createStyles } from './styles';

type Item = { id: number; name: string };

// ── Registry ──────────────────────────────────────────────────────────────
type Archetype = 'multiselect' | 'common' | 'capacity' | 'address';

const ARCHETYPE_BY_KEY: Record<string, Archetype> = {
  company: 'common',
  contact: 'common',
  brand: 'common',
  capacity: 'capacity',
  factory: 'address',
  location: 'address',
  converter_types: 'multiselect',
  machines: 'multiselect',
  finished_products: 'multiselect',
  raw_materials: 'multiselect',
  scrap_types: 'multiselect',
  industries: 'multiselect',
  preferred_brands: 'multiselect',
};

// editKey → payload field names for the address archetype.
const ADDRESS_FIELDS: Record<string, { address: string; city: string; state: string; lat: string; lng: string }> = {
  factory: {
    address: 'factory_address',
    city: 'factory_city',
    state: 'factory_state',
    lat: 'factory_latitude',
    lng: 'factory_longitude',
  },
  location: { address: 'address', city: 'city', state: 'state', lat: 'latitude', lng: 'longitude' },
};

const OPERATION_AREA_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'state', label: 'State Level' },
  { value: 'pan_india', label: 'Pan India' },
];

const CAPACITY_UNITS = ['pieces', 'kg', 'tonnes'];

// ── Editors ─────────────────────────────────────────────────────────────
const MultiSelectEditor: React.FC<{
  theme: Theme;
  styles: ReturnType<typeof createStyles>;
  title: string;
  items: Item[];
  loading: boolean;
  initialIds: number[];
  onChange: (ids: number[]) => void;
}> = ({ theme, styles, title, items, loading, initialIds, onChange }) => {
  const [selected, setSelected] = useState<number[]>(initialIds ?? []);
  const [search, setSearch] = useState('');
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    onChange(selected);
    // onChange intentionally omitted: it may be an inline callback whose identity
    // changes every render, which would loop. The underlying setter is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const selectedNames = useMemo(
    () =>
      items
        .filter((i) => selected.includes(i.id))
        .map((i) => i.name),
    [items, selected],
  );

  return (
    <View style={styles.fieldGroup}>
      <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>
        {title}
      </Text>
      <DropdownButton
        value={selected.length > 0 ? `${selected.length} selected` : ''}
        placeholder={loading ? 'Loading…' : 'Tap to select'}
        onPress={() => sheetRef.current?.present()}
        disabled={loading}
      />
      {selectedNames.length > 0 && (
        <Text variant="captionSmall" style={styles.sheetSelectedText} numberOfLines={2}>
          {selectedNames.join(', ')}
        </Text>
      )}
      <GorhomBottomSheetModal
        ref={sheetRef}
        snapPoints={['70%', '95%']}
        enablePanDownToClose
        doneFooter
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onDismiss={() => setSearch('')}
      >
        <MultiSelectBottomSheetContent
          title={title}
          searchQuery={search}
          onSearchChange={setSearch}
          items={items}
          selectedIds={selected}
          onSelect={(id) => setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]))}
          onDeselect={(id) => setSelected((prev) => prev.filter((x) => x !== id))}
          theme={theme}
          ListComponent={BottomSheetFlatList}
        />
      </GorhomBottomSheetModal>
    </View>
  );
};

const CommonFieldsEditor: React.FC<{
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
  edit: Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
}> = ({ styles, theme, edit, onChange }) => {
  const [companyName, setCompanyName] = useState<string>(edit.company_name ?? '');
  const [gstIn, setGstIn] = useState<string>(edit.gst_in ?? '');
  const [operationArea, setOperationArea] = useState<string>(edit.operation_area ?? '');
  const [city, setCity] = useState<string>(edit.city ?? '');
  const [state, setState] = useState<string>(edit.state ?? '');

  useEffect(() => {
    onChange({
      company_name: companyName.trim() || null,
      gst_in: gstIn.trim() || null,
      operation_area: operationArea || null,
      city: city.trim() || null,
      state: state.trim() || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, gstIn, operationArea, city, state]);

  return (
    <>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Company Name</Text>
        <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company name" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>GSTIN</Text>
        <TextInput style={styles.input} value={gstIn} onChangeText={setGstIn} autoCapitalize="characters" placeholder="GSTIN" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Operation Area</Text>
        <View style={styles.pillsRow}>
          {OPERATION_AREA_OPTIONS.map((opt) => {
            const active = operationArea?.toLowerCase() === opt.value;
            return (
              <TouchableOpacity key={opt.value} style={[styles.pill, active && styles.pillActive]} onPress={() => setOperationArea(opt.value)} activeOpacity={0.7}>
                <Text variant="bodySmall" style={active ? styles.pillTextActive : styles.pillText}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>State</Text>
        <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
    </>
  );
};

const CapacityEditor: React.FC<{
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
  edit: Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
}> = ({ styles, theme, edit, onChange }) => {
  const [daily, setDaily] = useState<string>(edit.capacity_daily != null ? String(edit.capacity_daily) : '');
  const [monthly, setMonthly] = useState<string>(edit.capacity_monthly != null ? String(edit.capacity_monthly) : '');
  const [unit, setUnit] = useState<string>(edit.capacity_unit ?? 'kg');

  useEffect(() => {
    onChange({
      capacity_daily: daily.trim() ? Number(daily) : null,
      capacity_monthly: monthly.trim() ? Number(monthly) : null,
      capacity_unit: unit || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily, monthly, unit]);

  return (
    <>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Daily Capacity</Text>
        <TextInput style={styles.input} value={daily} onChangeText={setDaily} keyboardType="numeric" returnKeyType="done" placeholder="e.g. 1000" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Monthly Capacity</Text>
        <TextInput style={styles.input} value={monthly} onChangeText={setMonthly} keyboardType="numeric" returnKeyType="done" placeholder="e.g. 30000" placeholderTextColor={theme.colors.text.tertiary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Unit</Text>
        <View style={styles.pillsRow}>
          {CAPACITY_UNITS.map((u) => {
            const active = unit === u;
            return (
              <TouchableOpacity key={u} style={[styles.pill, active && styles.pillActive]} onPress={() => setUnit(u)} activeOpacity={0.7}>
                <Text variant="bodySmall" style={active ? styles.pillTextActive : styles.pillText}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

const AddressEditor: React.FC<{
  styles: ReturnType<typeof createStyles>;
  editKey: string;
  edit: Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
}> = ({ styles, editKey, edit, onChange }) => {
  const fields = ADDRESS_FIELDS[editKey] ?? ADDRESS_FIELDS.location;
  const [display, setDisplay] = useState<string>(
    [edit.address, edit.city, edit.state].filter(Boolean).join(', '),
  );
  const [modalVisible, setModalVisible] = useState(false);

  const mapSeed: WarehouseFormMapData = useMemo(
    () => ({
      address: edit.address || '',
      city: edit.city || '',
      state: edit.state || '',
      pincode: '',
      latitude: edit.latitude ?? LOCATION_FALLBACK_COORDINATES.latitude,
      longitude: edit.longitude ?? LOCATION_FALLBACK_COORDINATES.longitude,
    }),
    [edit],
  );

  const handleSubmit = useCallback(
    (data: {
      name: string; location1: string; location2: string; state: string;
      city: string; pincode: string; latitude: number; longitude: number;
    }) => {
      const street = [data.location1, data.location2].filter(Boolean).join(', ');
      const full = [street, data.city, data.state, data.pincode].filter(Boolean).join(', ');
      setDisplay(full || street);
      onChange({
        [fields.address]: full || street,
        [fields.city]: data.city,
        [fields.state]: data.state,
        [fields.lat]: data.latitude,
        [fields.lng]: data.longitude,
      });
      setModalVisible(false);
    },
    [fields, onChange],
  );

  return (
    <View style={styles.fieldGroup}>
      <Text variant="bodyMedium" fontWeight="medium" style={styles.label}>Address</Text>
      <View style={styles.addressPreview}>
        <Text variant="bodyMedium" style={display ? styles.addressText : styles.addressPlaceholder}>
          {display || 'No address set'}
        </Text>
      </View>
      <CustomButton title={display ? 'Change Address' : 'Set Address'} onPress={() => setModalVisible(true)} variant="outline" size="md" />
      {modalVisible && (
        <StructuredAddressFormModal
          visible={modalVisible}
          title="Edit address"
          onDismiss={() => setModalVisible(false)}
          mapData={mapSeed}
          existingLocation={null}
          coordinatesOverride={LOCATION_FALLBACK_COORDINATES}
          showNameField={false}
          onSubmit={handleSubmit}
          submitLabel="Save address"
        />
      )}
    </View>
  );
};

// ── Screen ──────────────────────────────────────────────────────────────
type EditRoute = RouteProp<MainStackParamList, 'EditRegistrationSection'>;

const EditRegistrationSectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EditRoute>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();

  const { role, editKey, title, edit } = route.params;
  const archetype = ARCHETYPE_BY_KEY[editKey] ?? 'multiselect';

  const [payload, setPayload] = useState<Record<string, any>>({});
  const updateSection = useUpdateProfileSection(role);

  const handleMultiSelectChange = useCallback(
    (field: string, ids: number[]) => {
      setPayload((p) => ({ ...p, [field]: ids }));
    },
    [],
  );

  const handlePatch = useCallback((patch: Record<string, any>) => {
    setPayload((p) => ({ ...p, ...patch }));
  }, []);

  const handleSave = useCallback(() => {
    updateSection.mutate(payload, {
      onSuccess: () => {
        dispatch(showToast({ message: 'Updated successfully', type: 'success' }));
        navigation.goBack();
      },
      onError: (err: any) => {
        dispatch(showToast({ message: err?.message || 'Could not update. Please try again.', type: 'error' }));
      },
    });
  }, [updateSection, payload, dispatch, navigation]);

  const renderEditor = () => {
    if (archetype === 'multiselect') {
      const items: Item[] = Array.isArray(edit?.options) ? edit.options : [];
      const field: string = edit?.field ?? `${editKey}_ids`;
      return (
        <MultiSelectEditor
          theme={theme}
          styles={styles}
          title={title}
          items={items}
          loading={false}
          initialIds={Array.isArray(edit?.selected_ids) ? edit.selected_ids : []}
          onChange={(ids) => handleMultiSelectChange(field, ids)}
        />
      );
    }
    if (archetype === 'common') {
      return <CommonFieldsEditor styles={styles} theme={theme} edit={edit ?? {}} onChange={handlePatch} />;
    }
    if (archetype === 'capacity') {
      return <CapacityEditor styles={styles} theme={theme} edit={edit ?? {}} onChange={handlePatch} />;
    }
    return <AddressEditor styles={styles} editKey={editKey} edit={edit ?? {}} onChange={handlePatch} />;
  };

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper safeAreaEdges={['top', 'bottom']} backgroundColor={theme.colors.background.primary}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h5" fontWeight="semibold" style={styles.headerTitle} numberOfLines={1}>
            Edit {title}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {renderEditor()}
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            variant="gradient"
            size="lg"
            fullWidth
            loading={updateSection.isPending}
            disabled={updateSection.isPending}
          />
        </View>
      </ScreenWrapper>
    </BottomSheetModalProvider>
  );
};

export default EditRegistrationSectionScreen;
