import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const BACKUP_VERSION = "1.0.0";

interface BackupData {
  version: string;
  timestamp: string;
  cache: any;
  settings: any;
  history: any;
  favorites: any;
  highlights: any;
  annotations: any;
  offlineStats: any;
  readingSettings: any;
  scheduledDownloads: any;
  downloadSuggestions: any;
}

export function useBackupRestore() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportBackup = async (): Promise<boolean> => {
    try {
      setExporting(true);
      setProgress(0);

      // Coletar todos os dados do AsyncStorage
      const keys = [
        "offline_cache",
        "reading_history",
        "favorites",
        "highlights",
        "annotations",
        "offline_stats",
        "reading_settings",
        "scheduled_downloads",
        "download_suggestions",
        "rejected_suggestions",
        "smart_sync_history",
      ];

      setProgress(10);

      const backupData: BackupData = {
        version: BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        cache: null,
        settings: null,
        history: null,
        favorites: null,
        highlights: null,
        annotations: null,
        offlineStats: null,
        readingSettings: null,
        scheduledDownloads: null,
        downloadSuggestions: null,
      };

      // Ler cada chave do AsyncStorage
      let progressStep = 0;
      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          switch (key) {
            case "offline_cache":
              backupData.cache = JSON.parse(data);
              break;
            case "reading_history":
              backupData.history = JSON.parse(data);
              break;
            case "favorites":
              backupData.favorites = JSON.parse(data);
              break;
            case "highlights":
              backupData.highlights = JSON.parse(data);
              break;
            case "annotations":
              backupData.annotations = JSON.parse(data);
              break;
            case "offline_stats":
              backupData.offlineStats = JSON.parse(data);
              break;
            case "reading_settings":
              backupData.readingSettings = JSON.parse(data);
              break;
            case "scheduled_downloads":
              backupData.scheduledDownloads = JSON.parse(data);
              break;
            case "download_suggestions":
            case "rejected_suggestions":
            case "smart_sync_history":
              if (!backupData.downloadSuggestions) {
                backupData.downloadSuggestions = {};
              }
              backupData.downloadSuggestions[key] = JSON.parse(data);
              break;
          }
        }
        progressStep++;
        setProgress(10 + (progressStep / keys.length) * 60);
      }

      setProgress(70);

      // Salvar em arquivo
      const fileName = `siga_o_dinheiro_backup_${Date.now()}.json`;
      const file = new File(Paths.cache, fileName);
      await file.write(JSON.stringify(backupData, null, 2));

      setProgress(90);

      // Compartilhar arquivo
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Backup do Siga o Dinheiro",
        });
      }

      setProgress(100);
      return true;
    } catch (error) {
      console.error("[BackupRestore] Export failed:", error);
      return false;
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const importBackup = async (): Promise<boolean> => {
    try {
      setImporting(true);
      setProgress(0);

      // Selecionar arquivo
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setImporting(false);
        return false;
      }

      setProgress(10);

      // Ler arquivo
      const file = new File(result.assets[0].uri);
      const fileContent = await file.text();

      setProgress(30);

      // Parse JSON
      const backupData: BackupData = JSON.parse(fileContent);

      // Validar versão
      if (!backupData.version || backupData.version !== BACKUP_VERSION) {
        console.error("[BackupRestore] Invalid backup version");
        return false;
      }

      setProgress(40);

      // Restaurar dados
      const restoreSteps = [
        { key: "offline_cache", data: backupData.cache },
        { key: "reading_history", data: backupData.history },
        { key: "favorites", data: backupData.favorites },
        { key: "highlights", data: backupData.highlights },
        { key: "annotations", data: backupData.annotations },
        { key: "offline_stats", data: backupData.offlineStats },
        { key: "reading_settings", data: backupData.readingSettings },
        { key: "scheduled_downloads", data: backupData.scheduledDownloads },
      ];

      let progressStep = 0;
      for (const step of restoreSteps) {
        if (step.data) {
          await AsyncStorage.setItem(step.key, JSON.stringify(step.data));
        }
        progressStep++;
        setProgress(40 + (progressStep / restoreSteps.length) * 50);
      }

      // Restaurar sugestões de download
      if (backupData.downloadSuggestions) {
        for (const [key, data] of Object.entries(backupData.downloadSuggestions)) {
          await AsyncStorage.setItem(key, JSON.stringify(data));
        }
      }

      setProgress(100);
      return true;
    } catch (error) {
      console.error("[BackupRestore] Import failed:", error);
      return false;
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const getBackupSize = async (): Promise<number> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }

      // Retornar tamanho em MB
      return totalSize / (1024 * 1024);
    } catch (error) {
      console.error("[BackupRestore] Failed to calculate backup size:", error);
      return 0;
    }
  };

  return {
    exporting,
    importing,
    progress,
    exportBackup,
    importBackup,
    getBackupSize,
  };
}
