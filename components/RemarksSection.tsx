import { useState, useMemo } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from './AppButton';
import { InfoCard } from './InfoCard';
import { useAppData } from '../utils/appState';
import { formatShortDate } from '../utils/format';
import { type AppTheme, useAppTheme } from '../utils/themeContext';

interface RemarksSectionProps {
  module: string;
  referenceId: string;
  title?: string;
}

export function RemarksSection({ module, referenceId, title = 'Remarks' }: RemarksSectionProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { remarks, addRemark, currentUser } = useAppData();
  const [text, setText] = useState('');

  const items = remarks.filter((item) => item.module === module && item.referenceId === referenceId);

  const onAdd = () => {
    if (!text.trim()) {
      return;
    }

    addRemark(module, referenceId, text.trim());
    setText('');
    Alert.alert('Remark saved', 'The new demo remark has been added.');
  };

  return (
    <InfoCard title={title} subtitle="Simple note section for site, payment, material, and employee remarks.">
      <View style={styles.list}>
        {items.length === 0 ? <Text style={styles.empty}>No remarks yet.</Text> : null}
        {items.map((item) => (
          <View key={item.id} style={styles.remarkItem}>
            <Text style={styles.remarkText}>{item.text}</Text>
            <Text style={styles.meta}>{formatShortDate(item.date)} • {item.authorRole}</Text>
          </View>
        ))}
      </View>
      {currentUser ? (
        <View style={styles.form}>
          <TextInput
            multiline
            onChangeText={setText}
            placeholder="Type a short remark"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={text}
          />
          <AppButton label="Add Remark" onPress={onAdd} />
        </View>
      ) : null}
    </InfoCard>
  );
}

function makeStyles(theme: AppTheme) { return StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  remarkItem: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    padding: theme.spacing.sm + 2,
    gap: 4,
  },
  remarkText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeightBody,
  },
  meta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  empty: {
    fontSize: theme.typography.small,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  form: {
    gap: theme.spacing.sm,
  },
  input: {
    minHeight: 90,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.control.inputBorder,
    backgroundColor: theme.colors.inputBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    textAlignVertical: 'top',
  },
}); }