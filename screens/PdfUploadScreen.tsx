import { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { InfoCard } from '../components/InfoCard';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppData } from '../utils/appState';

const uploadTypes = ['Land Layout', 'Building Plan', 'Agreement', 'Approval', 'Estimate'];

export function PdfUploadScreen() {
  const { currentUser, hasAccess, saveUpload, uploads } = useAppData();
  const [selectedType, setSelectedType] = useState(uploadTypes[0]);

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('pdfUpload')) {
    return (
      <ScreenContainer title="PDF Upload" subtitle="This role cannot upload documents.">
        <AccessDenied title="PDF uploads are restricted" />
      </ScreenContainer>
    );
  }

  const onPickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return;
    }

    const file = result.assets[0];
    saveUpload({
      id: `UPL${Date.now()}`,
      module: 'pdfUpload',
      referenceId: selectedType,
      name: file.name,
      uri: file.uri,
      mimeType: file.mimeType ?? 'application/pdf',
      uploadedAt: new Date().toISOString(),
    });
    Alert.alert('PDF selected', `${file.name} has been added to the local demo list.`);
  };

  const filteredUploads = uploads.filter((upload) => upload.referenceId === selectedType);

  return (
    <ScreenContainer title="PDF Upload" subtitle="Frontend-only document picker for layout, agreement, estimate, and approval PDFs.">
      <InfoCard title="Choose Document Type" subtitle="Select the document bucket before picking a file.">
        <FilterChips onChange={setSelectedType} selectedValue={selectedType} values={uploadTypes} />
        <AppButton label="Pick PDF File" onPress={onPickPdf} />
      </InfoCard>

      <InfoCard title="Selected Files" subtitle={`Files stored in local state for ${selectedType}.`}>
        {filteredUploads.length === 0 ? <EmptyState title="No Files Yet" description="Pick a PDF to see it listed here." /> : null}
        {filteredUploads.map((upload) => (
          <View key={upload.id} style={styles.fileRow}>
            <Text style={styles.fileName}>{upload.name}</Text>
            <Text style={styles.fileMeta}>{upload.uploadedAt}</Text>
            <AppButton label="Open Preview" onPress={() => Linking.openURL(upload.uri)} variant="outline" />
          </View>
        ))}
      </InfoCard>

      <RemarksSection module="pdfUpload" referenceId={selectedType} title="PDF Remarks" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fileRow: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.card.sectionBorder,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    padding: theme.spacing.sm,
    paddingLeft: theme.spacing.sm + 2,
    gap: 6,
  },
  fileName: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  fileMeta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textLight,
  },
});