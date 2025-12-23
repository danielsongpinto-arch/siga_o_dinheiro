import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_KEY = "reading_progress";

export interface ReadingProgress {
  articleId: string;
  progress: number; // 0-100
  scrollPosition: number;
  lastRead: string;
  completed: boolean;
}

export function useReadingProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) {
        setProgressMap(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading reading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = useCallback(
    async (
      articleId: string,
      scrollPosition: number,
      contentHeight: number,
      scrollHeight: number,
      onArticleCompleted?: () => Promise<void>
    ) => {
      try {
        // Calcular progresso baseado em scroll
        const maxScroll = contentHeight - scrollHeight;
        const progress = maxScroll > 0 ? Math.min(100, (scrollPosition / maxScroll) * 100) : 0;
        const completed = progress >= 90; // Considera completo se ler 90%

        // Verificar se acabou de completar (não estava completo antes)
        const wasCompleted = progressMap[articleId]?.completed || false;
        const justCompleted = completed && !wasCompleted;

        const newProgress: ReadingProgress = {
          articleId,
          progress: Math.round(progress),
          scrollPosition,
          lastRead: new Date().toISOString(),
          completed,
        };

        const updated = {
          ...progressMap,
          [articleId]: newProgress,
        };

        setProgressMap(updated);
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));

        // Se acabou de completar, chamar callback
        if (justCompleted && onArticleCompleted) {
          try {
            await onArticleCompleted();
          } catch (callbackError) {
            console.error("Error in onArticleCompleted callback:", callbackError);
          }
        }
      } catch (error) {
        console.error("Error updating reading progress:", error);
      }
    },
    [progressMap]
  );

  const getProgress = useCallback(
    (articleId: string): ReadingProgress | null => {
      return progressMap[articleId] || null;
    },
    [progressMap]
  );

  const calculateEstimatedTime = useCallback(
    (articleContent: string, currentProgress: number): number => {
      // Contar palavras no conteúdo
      const words = articleContent.split(/\s+/).length;
      
      // Velocidade média de leitura: 200 palavras por minuto
      const wordsPerMinute = 200;
      
      // Calcular palavras restantes
      const wordsRemaining = words * ((100 - currentProgress) / 100);
      
      // Calcular tempo em minutos
      return wordsRemaining / wordsPerMinute;
    },
    []
  );

  const clearProgress = useCallback(
    async (articleId: string) => {
      try {
        const updated = { ...progressMap };
        delete updated[articleId];
        setProgressMap(updated);
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error clearing progress:", error);
      }
    },
    [progressMap]
  );

  const getAllProgress = useCallback((): ReadingProgress[] => {
    return Object.values(progressMap);
  }, [progressMap]);

  const getCompletedCount = useCallback((): number => {
    return Object.values(progressMap).filter((p) => p.completed).length;
  }, [progressMap]);

  return {
    loading,
    updateProgress,
    getProgress,
    clearProgress,
    getAllProgress,
    getCompletedCount,
    calculateEstimatedTime,
  };
}
