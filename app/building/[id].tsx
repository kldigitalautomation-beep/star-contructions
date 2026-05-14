import { Redirect, useLocalSearchParams } from 'expo-router';
import { getBuildingSectionHref } from '../../utils/buildingModule';

export default function BuildingDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href="/buildings" />;
  }

  return <Redirect href={getBuildingSectionHref(id, 'overview')} />;
}