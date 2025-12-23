import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "review_tracking";

export interface ReviewTrackingData {
  reviewCount: number; // Contador de revisões de destaques antigos
  lastReviewDate?: string; // Data da última revisão
}

const DEFAULT_DATA: ReviewTrackingData = {
  reviewCount: 0,
};

export function useReviewTracking() {
  const [data, setData] = useState<ReviewTrackingData>(DEFAULT_DATA);
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
      console.error("Error loading review tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: ReviewTrackingData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Error saving review tracking data:", error);
    }
  };

  // Incrementar contador de revisões
  const incrementReviewCount = async () => {
    const newData: ReviewTrackingData = {
      reviewCount: data.reviewCount + 1,
      lastReviewDate: new Date().toISOString(),
    };
    await saveData(newData);
  };

  // Verificar se um destaque é antigo (30+ dias)
  const isOldBookmark = (createdAt: string): boolean => {
    const bookmarkDate = new Date(createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - bookmarkDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 30;
  };

  // Registrar visualização de destaque antigo
  const trackBookmarkView = async (createdAt: string) => {
    if (isOldBookmark(createdAt)) {
      await incrementReviewCount();
      return true; // Retorna true se foi contado como revisão
    }
    return false;
  };

  return {
    reviewCount: data.reviewCount,
    lastReviewDate: data.lastReviewDate,
    loading,
    trackBookmarkView,
    isOldBookmark,
  };
}
