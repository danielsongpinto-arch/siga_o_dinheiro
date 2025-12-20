import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SeriesProgress } from "@/types/series";
import { SERIES } from "@/data/series-data";

const SERIES_PROGRESS_KEY = "@siga_o_dinheiro:series_progress";

export function useSeriesProgress() {
  const [progress, setProgress] = useState<SeriesProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(SERIES_PROGRESS_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading series progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newProgress: SeriesProgress[]) => {
    try {
      await AsyncStorage.setItem(SERIES_PROGRESS_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Error saving series progress:", error);
    }
  };

  const markArticleCompleted = async (seriesId: string, articleId: string) => {
    const series = SERIES.find((s) => s.id === seriesId);
    if (!series) return;

    const existingProgress = progress.find((p) => p.seriesId === seriesId);
    
    if (existingProgress) {
      // Adicionar artigo aos completados se ainda não estiver
      if (!existingProgress.completedArticleIds.includes(articleId)) {
        const updatedCompletedIds = [...existingProgress.completedArticleIds, articleId];
        const currentIndex = series.articleIds.indexOf(articleId);
        const isSeriesCompleted = updatedCompletedIds.length === series.totalParts;

        const updatedProgress: SeriesProgress = {
          ...existingProgress,
          completedArticleIds: updatedCompletedIds,
          currentPartIndex: Math.min(currentIndex + 1, series.totalParts - 1),
          completedAt: isSeriesCompleted ? new Date().toISOString() : undefined,
        };

        const newProgress = progress.map((p) =>
          p.seriesId === seriesId ? updatedProgress : p
        );
        await saveProgress(newProgress);
      }
    } else {
      // Criar novo progresso
      const currentIndex = series.articleIds.indexOf(articleId);
      const isSeriesCompleted = series.totalParts === 1;

      const newSeriesProgress: SeriesProgress = {
        seriesId,
        completedArticleIds: [articleId],
        currentPartIndex: Math.min(currentIndex + 1, series.totalParts - 1),
        completedAt: isSeriesCompleted ? new Date().toISOString() : undefined,
      };

      await saveProgress([...progress, newSeriesProgress]);
    }
  };

  const getSeriesProgress = (seriesId: string): SeriesProgress | undefined => {
    return progress.find((p) => p.seriesId === seriesId);
  };

  const getProgressPercentage = (seriesId: string): number => {
    const series = SERIES.find((s) => s.id === seriesId);
    const seriesProgress = getSeriesProgress(seriesId);
    
    if (!series || !seriesProgress) return 0;
    
    return Math.round((seriesProgress.completedArticleIds.length / series.totalParts) * 100);
  };

  const isSeriesCompleted = (seriesId: string): boolean => {
    const seriesProgress = getSeriesProgress(seriesId);
    return !!seriesProgress?.completedAt;
  };

  const getNextArticleId = (seriesId: string): string | null => {
    const series = SERIES.find((s) => s.id === seriesId);
    const seriesProgress = getSeriesProgress(seriesId);
    
    if (!series) return null;
    
    if (!seriesProgress) {
      return series.articleIds[0];
    }
    
    const nextIndex = seriesProgress.currentPartIndex;
    return series.articleIds[nextIndex] || null;
  };

  const getCompletedSeriesCount = (): number => {
    return progress.filter((p) => p.completedAt).length;
  };

  return {
    progress,
    loading,
    markArticleCompleted,
    getSeriesProgress,
    getProgressPercentage,
    isSeriesCompleted,
    getNextArticleId,
    getCompletedSeriesCount,
  };
}
