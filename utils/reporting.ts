import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function createTextReport(fileName: string, content: string) {
  const baseDirectory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

  if (!baseDirectory) {
    throw new Error('File system is not available on this device.');
  }

  const safeName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  const uri = `${baseDirectory}${safeName}`;

  await FileSystem.writeAsStringAsync(uri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return uri;
}

export async function shareTextReport(fileName: string, content: string) {
  const uri = await createTextReport(fileName, content);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri);
  }

  return uri;
}