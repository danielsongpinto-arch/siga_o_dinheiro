import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

const STORAGE_KEY = "data_saver_settings";

interface DataSaverSettings {
  enabled: boolean;
  disableImages: boolean;
  disableAudio: boolean;
}

const DEFAULT_SETTINGS: DataSaverSettings = {
  enabled: false,
  disableImages: true,
  disableAudio: true,
};

export function useDataSaver() {
  const [settings, setSettings] = useState<DataSaverSettings>(DEFAULT_SETTINGS);
  const [isOnCellular, setIsOnCellular] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  // Monitorar tipo de conexão
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnCellular(state.type === "cellular");
    });

    return () => unsubscribe();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading data saver settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: DataSaverSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving data saver settings:", error);
    }
  };

  const toggleDataSaver = async () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    await saveSettings(newSettings);
  };

  const toggleImages = async () => {
    const newSettings = { ...settings, disableImages: !settings.disableImages };
    await saveSettings(newSettings);
  };

  const toggleAudio = async () => {
    const newSettings = { ...settings, disableAudio: !settings.disableAudio };
    await saveSettings(newSettings);
  };

  // Determinar se deve bloquear carregamento de mídia
  const shouldBlockImages = () => {
    return settings.enabled && settings.disableImages && isOnCellular;
  };

  const shouldBlockAudio = () => {
    return settings.enabled && settings.disableAudio && isOnCellular;
  };

  return {
    settings,
    loading,
    isOnCellular,
    toggleDataSaver,
    toggleImages,
    toggleAudio,
    shouldBlockImages,
    shouldBlockAudio,
  };
}
