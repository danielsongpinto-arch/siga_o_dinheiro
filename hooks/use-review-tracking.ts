import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "review_tracking";

export interface ReviewEntry {
  id: string;
  articleId: string;
  articleTitle: string;
  bookmarkText: string;
  reviewedAt: string;
}

export interface ReviewTrackingData {
  reviewCount: number; // Contador de revisões de destaques antigos
  lastReviewDate?: string; // Data da última revisão
  history: ReviewEntry[]; // Histórico de revisões (máximo 20)
}

const DEFAULT_DATA: ReviewTrackingData = {
  reviewCount: 0,
  history: [],
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

  // Incrementar contador de revisões e adicionar ao histórico
  const addReviewEntry = async (entry: Omit<ReviewEntry, "id" | "reviewedAt">) => {
    const newEntry: ReviewEntry = {
      ...entry,
      id: Date.now().toString(),
      reviewedAt: new Date().toISOString(),
    };
    
    // Adicionar nova entrada no início do histórico
    const newHistory = [newEntry, ...data.history];
    
    // Limitar a 20 entradas mais recentes
    if (newHistory.length > 20) {
      newHistory.splice(20);
    }
    
    const newData: ReviewTrackingData = {
      reviewCount: data.reviewCount + 1,
      lastReviewDate: newEntry.reviewedAt,
      history: newHistory,
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
  const trackBookmarkView = async (createdAt: string, articleId: string, articleTitle: string, bookmarkText: string) => {
    if (isOldBookmark(createdAt)) {
      await addReviewEntry({
        articleId,
        articleTitle,
        bookmarkText,
      });
      return true; // Retorna true se foi contado como revisão
    }
    return false;
  };

  return {
    reviewCount: data.reviewCount,
    lastReviewDate: data.lastReviewDate,
    history: data.history,
    loading,
    trackBookmarkView,
    isOldBookmark,
  };
}
