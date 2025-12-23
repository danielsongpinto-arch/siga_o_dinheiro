import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CachedArticle } from "./use-offline-cache";

const CACHE_KEY_PREFIX = "offline_article_";

/**
 * Hook para atualizar lastAccessedAt quando um artigo em cache é aberto
 */
export function useUpdateArticleAccess(articleId: string) {
  useEffect(() => {
    const updateAccessTime = async () => {
      try {
        const cacheKey = `${CACHE_KEY_PREFIX}${articleId}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        
        if (cachedData) {
          const cached: CachedArticle = JSON.parse(cachedData);
          
          // Atualizar lastAccessedAt
          const updated: CachedArticle = {
            ...cached,
            lastAccessedAt: new Date().toISOString(),
          };
          
          await AsyncStorage.setItem(cacheKey, JSON.stringify(updated));
        }
      } catch (error) {
        console.error("Error updating article access time:", error);
      }
    };

    updateAccessTime();
  }, [articleId]);
}
