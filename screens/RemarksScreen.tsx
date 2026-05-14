import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { type AppTheme, useAppTheme } from '../utils/themeContext';
import { useAppData } from '../utils/appState';
import { formatShortDate } from '../utils/format';

export function RemarksScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { currentUser, remarks } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <ScreenContainer title="Remarks" subtitle="All recent remarks from land, building, employee, payment, material, and vendor modules.">
      <FlatList
        contentContainerStyle={styles.content}
        data={remarks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No Remarks" description="There are no remarks in the demo yet." />}
        renderItem={({ item }) => (
          <InfoCard subtitle={`${item.module} • ${item.referenceId}`} title={item.text}>
            <Text style={styles.meta}>{formatShortDate(item.date)} • {item.authorRole}</Text>
          </InfoCard>
        )}
        scrollEnabled={false}
      />
    </ScreenContainer>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
  },
  meta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
  },
}); }