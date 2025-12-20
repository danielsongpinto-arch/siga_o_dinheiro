import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HIGHLIGHTS_KEY = "@siga_o_dinheiro:highlights";

export interface Highlight {
  id: string;
  articleId: string;
  articleTitle: string;
  text: string;
  createdAt: string;
  note?: string;
}

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const stored = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
      if (stored) {
        setHighlights(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = async (
    articleId: string,
    articleTitle: string,
    text: string,
    note?: string
  ) => {
    try {
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        articleId,
        articleTitle,
        text,
        note,
        createdAt: new Date().toISOString(),
      };

      const updated = [newHighlight, ...highlights];
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
      setHighlights(updated);
      return newHighlight;
    } catch (error) {
      console.error("Error adding highlight:", error);
      return null;
    }
  };

  const removeHighlight = async (highlightId: string) => {
    try {
      const updated = highlights.filter((h) => h.id !== highlightId);
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
      setHighlights(updated);
    } catch (error) {
      console.error("Error removing highlight:", error);
    }
  };

  const updateHighlightNote = async (highlightId: string, note: string) => {
    try {
      const updated = highlights.map((h) =>
        h.id === highlightId ? { ...h, note } : h
      );
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(updated));
      setHighlights(updated);
    } catch (error) {
      console.error("Error updating highlight note:", error);
    }
  };

  const getArticleHighlights = (articleId: string): Highlight[] => {
    return highlights.filter((h) => h.articleId === articleId);
  };

  const clearAllHighlights = async () => {
    try {
      await AsyncStorage.removeItem(HIGHLIGHTS_KEY);
      setHighlights([]);
    } catch (error) {
      console.error("Error clearing highlights:", error);
    }
  };

  return {
    highlights,
    loading,
    addHighlight,
    removeHighlight,
    updateHighlightNote,
    getArticleHighlights,
    clearAllHighlights,
  };
}
