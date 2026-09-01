import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { buildCadenceExport } from '@/src/db/export';
import { todayLocalDate } from '@/src/domain';

export async function exportAndShareCadenceBackup(): Promise<void> {
  const payload = await buildCadenceExport();
  const json = JSON.stringify(payload, null, 2);
  const filename = `cadence-backup-${todayLocalDate()}.json`;

  if (Platform.OS === 'web') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  const path = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(path, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(path, {
    mimeType: 'application/json',
    dialogTitle: 'Export Cadence backup',
    UTI: 'public.json',
  });
}
