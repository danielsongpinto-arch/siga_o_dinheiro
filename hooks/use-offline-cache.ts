import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const CACHE_KEY_PREFIX = "offline_article_";
const CACHE_INDEX_KEY = "offline_cache_index";
const MAX_CACHE_SIZE = 50; // Máximo de artigos em cache

export interface CachedArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  series: string;
  tags: string[];
  cachedAt: string;
  lastAccessedAt: string;
}

export interface CacheIndex {
  articleIds: string[];
  totalSize: number; // em bytes (aproximado)
}

export interface DownloadProgress {
  articleId: string;
  progress: number; // 0-100
  status: "downloading" | "paused" | "queued" | "completed" | "error";
  priority: number; // 1-5, maior = mais prioritário
  articleTitle?: string;
  seriesName?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface ArticleWithSize extends CachedArticle {
  sizeInBytes: number;
  sizeFormatted: string;
}

export function useOfflineCache() {
  const [isOnline, setIsOnline] = useState(true);
  const [cacheIndex, setCacheIndex] = useState<CacheIndex>({ articleIds: [], totalSize: 0 });
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({});

  useEffect(() => {
    loadCacheIndex();
    setupNetworkListener();
  }, []);

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return unsubscribe;
  };

  const loadCacheIndex = async () => {
    try {
      const stored = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      if (stored) {
        setCacheIndex(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading cache index:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCacheIndex = async (index: CacheIndex) => {
    try {
      await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
      setCacheIndex(index);
    } catch (error) {
      console.error("Error saving cache index:", error);
    }
  };

  const cacheArticle = async (article: CachedArticle): Promise<boolean> => {
    try {
      // Iniciar progresso
      setDownloadProgress((prev) => ({
        ...prev,
        [article.id]: {
          articleId: article.id,
          progress: 0,
          status: "downloading",
          priority: 3,
          articleTitle: article.title,
          startedAt: Date.now(),
        },
      }));

      const articleKey = `${CACHE_KEY_PREFIX}${article.id}`;
      const articleData = JSON.stringify(article);
      const articleSize = new Blob([articleData]).size;

      // Simular progresso (AsyncStorage é síncrono, mas damos feedback visual)
      setDownloadProgress((prev) => ({
        ...prev,
        [article.id]: { ...prev[article.id], progress: 50 },
      }));

      // Verificar se já está em cache
      if (cacheIndex.articleIds.includes(article.id)) {
        // Atualizar artigo existente
        await AsyncStorage.setItem(articleKey, articleData);
        return true;
      }

      // Verificar limite de cache
      if (cacheIndex.articleIds.length >= MAX_CACHE_SIZE) {
        // Implementar política LRU: remover artigo menos acessado recentemente
        let lruArticleId = cacheIndex.articleIds[0];
        let oldestAccessTime = new Date().getTime();

        // Encontrar artigo com lastAccessedAt mais antigo
        for (const articleId of cacheIndex.articleIds) {
          const cachedData = await AsyncStorage.getItem(`${CACHE_KEY_PREFIX}${articleId}`);
          if (cachedData) {
            const cached: CachedArticle = JSON.parse(cachedData);
            const accessTime = new Date(cached.lastAccessedAt).getTime();
            if (accessTime < oldestAccessTime) {
              oldestAccessTime = accessTime;
              lruArticleId = articleId;
            }
          }
        }

        await removeFromCache(lruArticleId);
      }

      // Salvar artigo
      await AsyncStorage.setItem(articleKey, articleData);

      // Atualizar índice
      const newIndex: CacheIndex = {
        articleIds: [...cacheIndex.articleIds, article.id],
        totalSize: cacheIndex.totalSize + articleSize,
      };
      await saveCacheIndex(newIndex);

      // Completar progresso
      setDownloadProgress((prev) => ({
        ...prev,
        [article.id]: {
          ...prev[article.id],
          progress: 100,
          status: "completed",
          completedAt: Date.now(),
        },
      }));

      // Limpar progresso após 2 segundos
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[article.id];
          return newProgress;
        });
      }, 2000);

      return true;
    } catch (error) {
      console.error("Error caching article:", error);
      
      // Marcar erro
      setDownloadProgress((prev) => ({
        ...prev,
        [article.id]: {
          ...prev[article.id],
          progress: 0,
          status: "error",
        },
      }));

      // Limpar erro após 3 segundos
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[article.id];
          return newProgress;
        });
      }, 3000);

      return false;
    }
  };

  const getCachedArticle = async (articleId: string): Promise<CachedArticle | null> => {
    try {
      const articleKey = `${CACHE_KEY_PREFIX}${articleId}`;
      const stored = await AsyncStorage.getItem(articleKey);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error("Error getting cached article:", error);
      return null;
    }
  };

  const isArticleCached = (articleId: string): boolean => {
    return cacheIndex.articleIds.includes(articleId);
  };

  const removeFromCache = async (articleId: string): Promise<boolean> => {
    try {
      const articleKey = `${CACHE_KEY_PREFIX}${articleId}`;
      
      // Obter tamanho antes de remover
      const stored = await AsyncStorage.getItem(articleKey);
      const articleSize = stored ? new Blob([stored]).size : 0;

      // Remover artigo
      await AsyncStorage.removeItem(articleKey);

      // Atualizar índice
      const newIndex: CacheIndex = {
        articleIds: cacheIndex.articleIds.filter((id) => id !== articleId),
        totalSize: Math.max(0, cacheIndex.totalSize - articleSize),
      };
      await saveCacheIndex(newIndex);

      return true;
    } catch (error) {
      console.error("Error removing from cache:", error);
      return false;
    }
  };

  const clearCache = async (): Promise<boolean> => {
    try {
      // Remover todos os artigos
      const removePromises = cacheIndex.articleIds.map((id) => {
        const key = `${CACHE_KEY_PREFIX}${id}`;
        return AsyncStorage.removeItem(key);
      });
      await Promise.all(removePromises);

      // Limpar índice
      const emptyIndex: CacheIndex = { articleIds: [], totalSize: 0 };
      await saveCacheIndex(emptyIndex);

      return true;
    } catch (error) {
      console.error("Error clearing cache:", error);
      return false;
    }
  };

  const getAllCachedArticles = async (): Promise<CachedArticle[]> => {
    try {
      const articles: CachedArticle[] = [];
      for (const id of cacheIndex.articleIds) {
        const article = await getCachedArticle(id);
        if (article) {
          articles.push(article);
        }
      }
      return articles;
    } catch (error) {
      console.error("Error getting all cached articles:", error);
      return [];
    }
  };

  const getCacheSizeFormatted = (): string => {
    const sizeInKB = cacheIndex.totalSize / 1024;
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }
    const sizeInMB = sizeInKB / 1024;
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const sizeInKB = bytes / 1024;
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }
    const sizeInMB = sizeInKB / 1024;
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const getAllCachedArticlesWithSize = async (): Promise<ArticleWithSize[]> => {
    try {
      const articles: ArticleWithSize[] = [];
      for (const id of cacheIndex.articleIds) {
        const articleKey = `${CACHE_KEY_PREFIX}${id}`;
        const data = await AsyncStorage.getItem(articleKey);
        if (data) {
          const article: CachedArticle = JSON.parse(data);
          const sizeInBytes = new Blob([data]).size;
          articles.push({
            ...article,
            sizeInBytes,
            sizeFormatted: formatBytes(sizeInBytes),
          });
        }
      }
      return articles;
    } catch (error) {
      console.error("Error getting articles with size:", error);
      return [];
    }
  };

  const getCacheUsagePercentage = (): number => {
    return (cacheIndex.articleIds.length / MAX_CACHE_SIZE) * 100;
  };

  return {
    isOnline,
    cacheIndex,
    loading,
    downloadProgress,
    cacheArticle,
    getCachedArticle,
    isArticleCached,
    removeFromCache,
    clearCache,
    getAllCachedArticles,
    getAllCachedArticlesWithSize,
    getCacheSizeFormatted,
    getCacheUsagePercentage,
    formatBytes,
  };
}
