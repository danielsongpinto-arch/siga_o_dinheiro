import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READING_HISTORY_KEY = "@siga_o_dinheiro:reading_history";

export interface ReadingHistoryItem {
  articleId: string;
  articleTitle: string;
  themeId: string;
  readAt: string;
  readingTime: number; // em minutos
  progress: number; // 0-100
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(READING_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading reading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (item: Omit<ReadingHistoryItem, "readAt">) => {
    try {
      // Remover entrada anterior do mesmo artigo
      const filtered = history.filter((h) => h.articleId !== item.articleId);
      
      const newItem: ReadingHistoryItem = {
        ...item,
        readAt: new Date().toISOString(),
      };

      const updated = [newItem, ...filtered];
      await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  const markAsRead = async (
    articleId: string,
    articleTitle: string,
    themeId: string,
    readingTime: number
  ) => {
    await addToHistory({
      articleId,
      articleTitle,
      themeId,
      readingTime,
      progress: 100,
    });
  };

  const updateProgress = async (
    articleId: string,
    articleTitle: string,
    themeId: string,
    progress: number,
    readingTime: number
  ) => {
    await addToHistory({
      articleId,
      articleTitle,
      themeId,
      readingTime,
      progress,
    });
  };

  const getArticleProgress = (articleId: string): number => {
    const item = history.find((h) => h.articleId === articleId);
    return item?.progress || 0;
  };

  const hasRead = (articleId: string): boolean => {
    const item = history.find((h) => h.articleId === articleId);
    return item?.progress === 100;
  };

  const getTotalReadingTime = (): number => {
    return history.reduce((total, item) => total + item.readingTime, 0);
  };

  const getReadArticlesCount = (): number => {
    return history.filter((item) => item.progress === 100).length;
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(READING_HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return {
    history,
    loading,
    addToHistory,
    markAsRead,
    updateProgress,
    getArticleProgress,
    hasRead,
    getTotalReadingTime,
    getReadArticlesCount,
    clearHistory,
  };
}
