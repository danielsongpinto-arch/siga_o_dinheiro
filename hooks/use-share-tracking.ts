import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "share_tracking";

export interface ShareTrackingData {
  shareCount: number; // Contador total de compartilhamentos
  lastShareDate?: string; // Data do último compartilhamento
}

const DEFAULT_DATA: ShareTrackingData = {
  shareCount: 0,
};

export function useShareTracking() {
  const [data, setData] = useState<ShareTrackingData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading share tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: ShareTrackingData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Error saving share tracking data:", error);
    }
  };

  // Incrementar contador de compartilhamentos
  const trackShare = async () => {
    const newData: ShareTrackingData = {
      shareCount: data.shareCount + 1,
      lastShareDate: new Date().toISOString(),
    };
    await saveData(newData);
  };

  return {
    shareCount: data.shareCount,
    lastShareDate: data.lastShareDate,
    loading,
    trackShare,
  };
}
