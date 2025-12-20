import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "@/types";

const OFFLINE_ARTICLES_KEY = "@siga_o_dinheiro:offline_articles";

export function useOfflineArticles() {
  const [offlineArticles, setOfflineArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfflineArticles();
  }, []);

  const loadOfflineArticles = async () => {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_ARTICLES_KEY);
      if (stored) {
        setOfflineArticles(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading offline articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveArticleOffline = async (article: Article) => {
    try {
      const exists = offlineArticles.some((a) => a.id === article.id);
      if (exists) return;

      const updated = [...offlineArticles, article];
      await AsyncStorage.setItem(OFFLINE_ARTICLES_KEY, JSON.stringify(updated));
      setOfflineArticles(updated);
    } catch (error) {
      console.error("Error saving article offline:", error);
    }
  };

  const removeArticleOffline = async (articleId: string) => {
    try {
      const updated = offlineArticles.filter((a) => a.id !== articleId);
      await AsyncStorage.setItem(OFFLINE_ARTICLES_KEY, JSON.stringify(updated));
      setOfflineArticles(updated);
    } catch (error) {
      console.error("Error removing article offline:", error);
    }
  };

  const isArticleOffline = (articleId: string): boolean => {
    return offlineArticles.some((a) => a.id === articleId);
  };

  const clearAllOfflineArticles = async () => {
    try {
      await AsyncStorage.removeItem(OFFLINE_ARTICLES_KEY);
      setOfflineArticles([]);
    } catch (error) {
      console.error("Error clearing offline articles:", error);
    }
  };

  return {
    offlineArticles,
    loading,
    saveArticleOffline,
    removeArticleOffline,
    isArticleOffline,
    clearAllOfflineArticles,
  };
}
