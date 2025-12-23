import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Battery from "expo-battery";
import * as Notifications from "expo-notifications";
import { useDownloadSuggestions } from "./use-download-suggestions";
import { useBatchDownload } from "./use-batch-download";

const SMART_SYNC_ENABLED_KEY = "smart_sync_enabled";
const SMART_SYNC_LOG_KEY = "smart_sync_log";
const MAX_LOG_ENTRIES = 20;

export interface SmartSyncLog {
  timestamp: number;
  articlesDownloaded: number;
  batteryLevel: number;
  success: boolean;
  error?: string;
}

export function useSmartSync() {
  const [enabled, setEnabled] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [isWifi, setIsWifi] = useState(false);
  const [isNightTime, setIsNightTime] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [syncLog, setSyncLog] = useState<SmartSyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  const { suggestions } = useDownloadSuggestions();
  const { downloadSeries } = useBatchDownload();

  useEffect(() => {
    loadSettings();
    setupMonitoring();
  }, []);

  useEffect(() => {
    // Verificar se deve executar sincronização automática
    if (enabled && isCharging && isWifi && isNightTime) {
      executeSyncIfNeeded();
    }
  }, [enabled, isCharging, isWifi, isNightTime]);

  const loadSettings = async () => {
    try {
      const [enabledData, logData] = await Promise.all([
        AsyncStorage.getItem(SMART_SYNC_ENABLED_KEY),
        AsyncStorage.getItem(SMART_SYNC_LOG_KEY),
      ]);

      if (enabledData) {
        setEnabled(JSON.parse(enabledData));
      }

      if (logData) {
        setSyncLog(JSON.parse(logData));
      }
    } catch (error) {
      console.error("Error loading smart sync settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupMonitoring = async () => {
    // Monitorar conexão de rede
    const unsubscribeNetwork = NetInfo.addEventListener((state) => {
      setIsWifi(state.type === "wifi" && state.isConnected === true);
    });

    // Monitorar status da bateria
    const batteryState = await Battery.getBatteryStateAsync();
    setIsCharging(batteryState === Battery.BatteryState.CHARGING);

    const batteryLevelValue = await Battery.getBatteryLevelAsync();
    setBatteryLevel(batteryLevelValue);

    // Atualizar a cada minuto
    const batteryInterval = setInterval(async () => {
      const state = await Battery.getBatteryStateAsync();
      setIsCharging(state === Battery.BatteryState.CHARGING);

      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
    }, 60000); // 1 minuto

    // Verificar horário noturno (22h-6h)
    const checkNightTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsNightTime(hour >= 22 || hour < 6);
    };

    checkNightTime();
    const nightInterval = setInterval(checkNightTime, 60000); // 1 minuto

    return () => {
      unsubscribeNetwork();
      clearInterval(batteryInterval);
      clearInterval(nightInterval);
    };
  };

  const toggleEnabled = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    await AsyncStorage.setItem(SMART_SYNC_ENABLED_KEY, JSON.stringify(newValue));

    if (newValue) {
      // Solicitar permissão de notificações ao ativar
      await Notifications.requestPermissionsAsync();
    }
  };

  const executeSyncIfNeeded = async () => {
    // Verificar se já sincronizou nas últimas 6 horas
    const lastSync = syncLog[0];
    if (lastSync) {
      const hoursSinceLastSync = (Date.now() - lastSync.timestamp) / (1000 * 60 * 60);
      if (hoursSinceLastSync < 6) {
        console.log("[SmartSync] Sync already executed recently, skipping");
        return;
      }
    }

    // Verificar se há sugestões pendentes
    if (suggestions.length === 0) {
      console.log("[SmartSync] No suggestions to download, skipping");
      return;
    }

    console.log("[SmartSync] Starting automatic sync...");

    try {
      let downloadedCount = 0;

      // Baixar todas as sugestões
      for (const suggestion of suggestions) {
        if (suggestion.article.themeId) {
          await downloadSeries(suggestion.article.themeId);
          downloadedCount++;
        }
      }

      // Registrar sucesso
      await addLogEntry({
        timestamp: Date.now(),
        articlesDownloaded: downloadedCount,
        batteryLevel,
        success: true,
      });

      // Enviar notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Sincronização Concluída",
          body: `${downloadedCount} ${downloadedCount === 1 ? "artigo baixado" : "artigos baixados"} automaticamente`,
        },
        trigger: null, // Imediato
      });

      console.log(`[SmartSync] Successfully downloaded ${downloadedCount} articles`);
    } catch (error) {
      console.error("[SmartSync] Sync failed:", error);

      // Registrar erro
      await addLogEntry({
        timestamp: Date.now(),
        articlesDownloaded: 0,
        batteryLevel,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const addLogEntry = async (entry: SmartSyncLog) => {
    const newLog = [entry, ...syncLog].slice(0, MAX_LOG_ENTRIES);
    setSyncLog(newLog);
    await AsyncStorage.setItem(SMART_SYNC_LOG_KEY, JSON.stringify(newLog));
  };

  const clearLog = async () => {
    setSyncLog([]);
    await AsyncStorage.removeItem(SMART_SYNC_LOG_KEY);
  };

  const getConditionsStatus = () => {
    return {
      charging: isCharging,
      wifi: isWifi,
      nightTime: isNightTime,
      allMet: isCharging && isWifi && isNightTime,
    };
  };

  const formatLogDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    enabled,
    loading,
    isCharging,
    isWifi,
    isNightTime,
    batteryLevel,
    syncLog,
    toggleEnabled,
    getConditionsStatus,
    formatLogDate,
    clearLog,
  };
}
