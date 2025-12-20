import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COMPARISON_KEY = "@siga_o_dinheiro:comparison";

export function useComparison() {
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      const stored = await AsyncStorage.getItem(COMPARISON_KEY);
      if (stored) {
        setSelectedArticleIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading comparison:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveComparison = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(COMPARISON_KEY, JSON.stringify(ids));
      setSelectedArticleIds(ids);
    } catch (error) {
      console.error("Error saving comparison:", error);
    }
  };

  const toggleArticle = async (articleId: string) => {
    const newIds = selectedArticleIds.includes(articleId)
      ? selectedArticleIds.filter((id) => id !== articleId)
      : [...selectedArticleIds, articleId].slice(0, 3); // Máximo 3 artigos

    await saveComparison(newIds);
  };

  const clearComparison = async () => {
    await saveComparison([]);
  };

  const isSelected = (articleId: string): boolean => {
    return selectedArticleIds.includes(articleId);
  };

  const canAddMore = (): boolean => {
    return selectedArticleIds.length < 3;
  };

  return {
    selectedArticleIds,
    loading,
    toggleArticle,
    clearComparison,
    isSelected,
    canAddMore,
  };
}
