import { Alert, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { AccessDenied } from '../components/AccessDenied';
import { AppButton } from '../components/AppButton';
import { InfoCard } from '../components/InfoCard';
import { RemarksSection } from '../components/RemarksSection';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppData } from '../utils/appState';
import { shareTextReport } from '../utils/reporting';

export function ReportsScreen() {
  const { buildings, currentUser, employees, hasAccess, payments, uploads } = useAppData();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  if (!hasAccess('reports')) {
    return (
      <ScreenContainer title="Reports" subtitle="This role cannot download records.">
        <AccessDenied title="Reports are restricted" />
      </ScreenContainer>
    );
  }

  const createReport = async (fileName: string, content: string) => {
    try {
      const uri = await shareTextReport(fileName, content);
      Alert.alert('Report ready', `Demo report prepared at ${uri}`);
    } catch (error) {
      Alert.alert('Report failed', error instanceof Error ? error.message : 'Unable to generate report.');
    }
  };

  return (
    <ScreenContainer title="Reports" subtitle="Frontend-only report download demo for payment, employee, project, and PDF records.">
      <InfoCard title="Download Reports" subtitle="These buttons generate local text reports you can share or save from the device.">
        <View style={styles.buttonGroup}>
          <AppButton
            label="Payment Summary"
            onPress={() =>
              createReport(
                'payment-summary',
                payments.map((payment) => `${payment.title} | ${payment.status} | ${payment.amount}`).join('\n'),
              )
            }
          />
          <AppButton
            label="Employee Report"
            onPress={() =>
              createReport(
                'employee-report',
                employees.map((employee) => `${employee.employeeName} | ${employee.roleTitle} | ${employee.assignedBuildingId}`).join('\n'),
              )
            }
            variant="secondary"
          />
          <AppButton
            label="Project Report"
            onPress={() =>
              createReport(
                'project-report',
                buildings.map((building) => `${building.buildingName} | ${building.constructionProgress}% | ${building.totalExpense}`).join('\n'),
              )
            }
            variant="outline"
          />
          <AppButton
            label="PDF Upload Report"
            onPress={() =>
              createReport(
                'pdf-report',
                uploads.length === 0 ? 'No uploads found.' : uploads.map((upload) => `${upload.referenceId} | ${upload.name}`).join('\n'),
              )
            }
            variant="outline"
          />
        </View>
      </InfoCard>

      <InfoCard title="Report Notes" subtitle="Demo-only frontend downloads with no backend or database.">
        <Text style={styles.note}>Payment Records: {payments.length}</Text>
        <Text style={styles.note}>Employee Records: {employees.length}</Text>
        <Text style={styles.note}>Project Records: {buildings.length}</Text>
        <Text style={styles.note}>Uploaded PDFs: {uploads.length}</Text>
      </InfoCard>

      <RemarksSection module="reports" referenceId="summary" title="Report Remarks" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    gap: theme.spacing.sm,
  },
  note: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    paddingVertical: 2,
  },
});