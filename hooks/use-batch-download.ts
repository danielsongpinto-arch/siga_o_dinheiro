import { useState } from "react";
import { useOfflineCache, CachedArticle } from "./use-offline-cache";
import { ARTICLES } from "@/data/mock-data";
import * as Haptics from "expo-haptics";

export interface BatchDownloadStatus {
  isDownloading: boolean;
  current: number;
  total: number;
  currentArticleId: string | null;
}

export function useBatchDownload() {
  const { cacheArticle } = useOfflineCache();
  const [batchStatus, setBatchStatus] = useState<Record<string, BatchDownloadStatus>>({});

  const downloadSeries = async (themeId: string): Promise<boolean> => {
    try {
      // Buscar todos os artigos da série
      const seriesArticles = ARTICLES.filter((a) => a.themeId === themeId);
      
      if (seriesArticles.length === 0) {
        return false;
      }

      // Iniciar status de download
      setBatchStatus((prev) => ({
        ...prev,
        [themeId]: {
          isDownloading: true,
          current: 0,
          total: seriesArticles.length,
          currentArticleId: null,
        },
      }));

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Download sequencial
      for (let i = 0; i < seriesArticles.length; i++) {
        const article = seriesArticles[i];
        
        // Atualizar status
        setBatchStatus((prev) => ({
          ...prev,
          [themeId]: {
            isDownloading: true,
            current: i + 1,
            total: seriesArticles.length,
            currentArticleId: article.id,
          },
        }));

        // Fazer download do artigo
        const cachedArticle: CachedArticle = {
          id: article.id,
          title: article.title,
          content: article.content,
          author: article.authors?.map((a) => a.name).join(", ") || "Autor",
          date: article.date,
          series: article.themeId,
          tags: [],
          cachedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
        };

        const success = await cacheArticle(cachedArticle);
        
        if (!success) {
          console.error(`Failed to cache article ${article.id}`);
        }

        // Pequeno delay entre downloads
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Completar download
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Limpar status após 2 segundos
      setTimeout(() => {
        setBatchStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[themeId];
          return newStatus;
        });
      }, 2000);

      return true;
    } catch (error) {
      console.error("Error downloading series:", error);
      
      // Limpar status em caso de erro
      setTimeout(() => {
        setBatchStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[themeId];
          return newStatus;
        });
      }, 3000);
      
      return false;
    }
  };

  const cancelDownload = (themeId: string) => {
    setBatchStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[themeId];
      return newStatus;
    });
  };

  const getSeriesArticleCount = (themeId: string): number => {
    return ARTICLES.filter((a) => a.themeId === themeId).length;
  };

  return {
    batchStatus,
    downloadSeries,
    cancelDownload,
    getSeriesArticleCount,
  };
}
