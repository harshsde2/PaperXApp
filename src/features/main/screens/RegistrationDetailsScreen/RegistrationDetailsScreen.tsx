import React, { useCallback, useRef } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/hooks/useTheme';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useRegistrationDetails } from '@services/api';
import { createStyles } from './styles';
import { SectionPillBar } from './components/SectionPillBar';
import { DetailSection } from './components/DetailSection';
import type { RegistrationSectionVM } from './@types';

const RegistrationDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { data, isLoading, isError, refetch } = useRegistrationDetails();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  const [activeSection, setActiveSection] = React.useState<string>('');

  const sections: RegistrationSectionVM[] = React.useMemo(() => {
    if (!data?.sections) return [];
    return data.sections.map((s) => ({
      id: s.id,
      title: s.title,
      icon: s.icon,
      rows: s.rows.map((r) => ({
        id: r.id,
        type: r.type ?? 'value',
        label: r.label,
        value: r.value,
        chips: r.chips,
      })),
    }));
  }, [data]);

  React.useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  const pillItems = React.useMemo(
    () => sections.map((s) => ({ id: s.id, title: s.title })),
    [sections],
  );

  const headerMetrics = React.useMemo(() => {
    const metrics: { label: string; value: string }[] = [];
    metrics.push({ label: 'Sections', value: String(sections.length) });

    let totalFields = 0;
    for (const sec of sections) {
      for (const row of sec.rows) {
        if (row.type === 'chip-list') {
          totalFields += row.chips?.length ?? 0;
        } else {
          totalFields += 1;
        }
      }
    }
    metrics.push({ label: 'Details', value: String(totalFields) });

    if (data?.role) {
      metrics.push({ label: 'Role', value: data.role.replace(/[_-]/g, ' ') });
    }
    return metrics;
  }, [sections, data]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePillPress = useCallback(
    (id: string) => {
      setActiveSection(id);
      const y = sectionOffsets.current[id];
      if (y !== undefined) {
        scrollRef.current?.scrollTo({ y, animated: true });
      }
    },
    [],
  );

  const handleSectionLayout = useCallback((id: string, y: number) => {
    sectionOffsets.current[id] = y;
  }, []);

  // ── Loading ──
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
              <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Registration Details</Text>
            </View>
          </View>
        </View>
        <View style={styles.errorWrap}>
          <AppIcon.Warning width={40} height={40} color={theme.colors.text.tertiary} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>
            We couldn't load your registration details. Check your connection and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.7}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Empty ──
  if (!sections.length) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
              <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Registration Details</Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyCard}>
          <AppIcon.Search width={36} height={36} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Details Found</Text>
          <Text style={styles.emptySubtitle}>
            We couldn't find any registration information for your account. Complete your profile to see details here.
          </Text>
        </View>
      </View>
    );
  }

  // ── Success ──
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <AppIcon.ArrowLeft width={20} height={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Registration Details</Text>
          </View>
          {data?.role ? (
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>{data.role.replace(/[_-]/g, ' ')}</Text>
            </View>
          ) : null}
        </View>

        {/* Quick metrics */}
        <View style={styles.metricsStrip}>
          {headerMetrics.map((m, i) => (
            <View key={i} style={styles.metricBox}>
              <Text style={styles.metricBoxValue}>{m.value}</Text>
              <Text style={styles.metricBoxLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section pill bar */}
      <SectionPillBar
        sections={pillItems}
        activeId={activeSection}
        onPress={handlePillPress}
      />

      {/* Sections */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View
            key={section.id}
            onLayout={(e) => handleSectionLayout(section.id, e.nativeEvent.layout.y)}
          >
            <DetailSection title={section.title} icon={section.icon} rows={section.rows} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RegistrationDetailsScreen;
