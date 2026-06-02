import { getDataExport } from '@/features/profile/api';
import { haptics } from '@/lib/haptics';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { toast } from 'sonner-native';

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const payload = await getDataExport();
      const json = JSON.stringify(payload, null, 2);
      const path = `${FileSystem.documentDirectory}cheevo-data-export.json`;

      await FileSystem.writeAsStringAsync(path, json);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: 'application/json',
          dialogTitle: 'Save your cheevo data',
          UTI: 'public.json',
        });
        haptics.success();
      } else {
        toast.success('Saved to your device.');
      }
    } catch (e: any) {
      haptics.error();
      toast.error(e?.message ?? 'Could not export your data.');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting };
}
