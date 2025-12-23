import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOfflineCache } from "./use-offline-cache";

const OFFLINE_STATS_KEY = "offline_reading_stats";

export interface OfflineReadingSession {
  articleId: string;
  articleTitle: string;
  startTime: number;
  endTime: number;
  duration: number; // em segundos
  wasOffline: boolean;
}

export interface OfflineStats {
  totalReadingsOffline: number;
  totalTimeOffline: number; // em segundos
  topArticlesOffline: { articleId: string; title: string; count: number }[];
  cacheUsageHistory: { date: string; articlesCount: number; sizeInBytes: number }[];
  lastUpdated: number;
}

export function useOfflineStats() {
  const [stats, setStats] = useState<OfflineStats>({
    totalReadingsOffline: 0,
    totalTimeOffline: 0,
    topArticlesOffline: [],
    cacheUsageHistory: [],
    lastUpdated: Date.now(),
  });
  const [loading, setLoading] = useState(true);
  const { isOnline, cacheIndex } = useOfflineCache();

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    // Registrar uso do cache diariamente
    recordCacheUsage();
  }, [cacheIndex]);

  const loadStats = async () => {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_STATS_KEY);
      if (data) {
        setStats(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading offline stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveStats = async (newStats: OfflineStats) => {
    try {
      await AsyncStorage.setItem(OFFLINE_STATS_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error("Error saving offline stats:", error);
    }
  };

  const recordReadingSession = async (session: OfflineReadingSession) => {
    if (!session.wasOffline) return; // Só registrar leituras offline

    const newStats = { ...stats };
    newStats.totalReadingsOffline += 1;
    newStats.totalTimeOffline += session.duration;
    newStats.lastUpdated = Date.now();

    // Atualizar top artigos
    const existingArticle = newStats.topArticlesOffline.find(
      (a) => a.articleId === session.articleId
    );
    if (existingArticle) {
      existingArticle.count += 1;
    } else {
      newStats.topArticlesOffline.push({
        articleId: session.articleId,
        title: session.articleTitle,
        count: 1,
      });
    }

    // Ordenar por contagem e pegar top 5
    newStats.topArticlesOffline.sort((a, b) => b.count - a.count);
    newStats.topArticlesOffline = newStats.topArticlesOffline.slice(0, 5);

    await saveStats(newStats);
  };

  const recordCacheUsage = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const newStats = { ...stats };

    // Verificar se já existe registro para hoje
    const existingIndex = newStats.cacheUsageHistory.findIndex((h) => h.date === today);

    const newEntry = {
      date: today,
      articlesCount: cacheIndex.articleIds.length,
      sizeInBytes: cacheIndex.totalSize,
    };

    if (existingIndex >= 0) {
      // Atualizar registro existente
      newStats.cacheUsageHistory[existingIndex] = newEntry;
    } else {
      // Adicionar novo registro
      newStats.cacheUsageHistory.push(newEntry);
    }

    // Manter apenas últimos 30 dias
    newStats.cacheUsageHistory.sort((a, b) => b.date.localeCompare(a.date));
    newStats.cacheUsageHistory = newStats.cacheUsageHistory.slice(0, 30);

    await saveStats(newStats);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getTotalTimeFormatted = (): string => {
    return formatDuration(stats.totalTimeOffline);
  };

  const getAverageReadingTime = (): string => {
    if (stats.totalReadingsOffline === 0) return "0m";
    const avgSeconds = Math.floor(stats.totalTimeOffline / stats.totalReadingsOffline);
    return formatDuration(avgSeconds);
  };

  const getCacheUsageTrend = (): "up" | "down" | "stable" => {
    if (stats.cacheUsageHistory.length < 2) return "stable";

    const sorted = [...stats.cacheUsageHistory].sort((a, b) => a.date.localeCompare(b.date));
    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];

    const diff = newest.articlesCount - oldest.articlesCount;
    if (diff > 2) return "up";
    if (diff < -2) return "down";
    return "stable";
  };

  const resetStats = async () => {
    const emptyStats: OfflineStats = {
      totalReadingsOffline: 0,
      totalTimeOffline: 0,
      topArticlesOffline: [],
      cacheUsageHistory: [],
      lastUpdated: Date.now(),
    };
    await saveStats(emptyStats);
  };

  return {
    stats,
    loading,
    isOnline,
    recordReadingSession,
    getTotalTimeFormatted,
    getAverageReadingTime,
    getCacheUsageTrend,
    resetStats,
  };
}
