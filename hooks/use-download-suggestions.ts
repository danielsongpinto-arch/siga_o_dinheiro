import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useReadingHistory } from "./use-reading-history";
import { useOfflineCache } from "./use-offline-cache";
import { getAllBookmarks } from "@/components/article-bookmarks";
import { ARTICLES } from "@/data/mock-data";
import { Article } from "@/types";

const REJECTED_SUGGESTIONS_KEY = "rejected_suggestions";
const SUGGESTION_EXPIRY_DAYS = 7; // Sugestões rejeitadas expiram após 7 dias

export interface DownloadSuggestion {
  article: Article;
  reason: string;
  score: number; // 0-100, quanto maior mais relevante
  type: "incomplete_series" | "related_bookmarks" | "popular_theme" | "favorite_author";
}

export function useDownloadSuggestions() {
  const [suggestions, setSuggestions] = useState<DownloadSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  
  const { history } = useReadingHistory();
  const { isArticleCached, getAllCachedArticles } = useOfflineCache();

  useEffect(() => {
    loadRejectedSuggestions();
  }, []);

  useEffect(() => {
    if (!loading) {
      generateSuggestions();
    }
  }, [history, loading]);

  const loadRejectedSuggestions = async () => {
    try {
      const data = await AsyncStorage.getItem(REJECTED_SUGGESTIONS_KEY);
      if (data) {
        const rejected: { id: string; rejectedAt: number }[] = JSON.parse(data);
        const now = Date.now();
        const expiryMs = SUGGESTION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        // Filtrar sugestões expiradas
        const active = rejected.filter((r) => now - r.rejectedAt < expiryMs);
        setRejectedIds(active.map((r) => r.id));
        
        // Salvar lista filtrada
        if (active.length !== rejected.length) {
          await AsyncStorage.setItem(REJECTED_SUGGESTIONS_KEY, JSON.stringify(active));
        }
      }
    } catch (error) {
      console.error("Error loading rejected suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const allSuggestions: DownloadSuggestion[] = [];
      
      // 1. Séries incompletas no cache
      const incompleteSeries = await findIncompleteSeries();
      allSuggestions.push(...incompleteSeries);
      
      // 2. Artigos relacionados aos destaques
      const relatedToBookmarks = await findRelatedToBookmarks();
      allSuggestions.push(...relatedToBookmarks);
      
      // 3. Temas mais lidos
      const popularThemes = findPopularThemes();
      allSuggestions.push(...popularThemes);
      
      // 4. Autores favoritos
      const favoriteAuthors = findFavoriteAuthors();
      allSuggestions.push(...favoriteAuthors);
      
      // Filtrar artigos já em cache e rejeitados
      const filtered = allSuggestions.filter(
        (s) => !isArticleCached(s.article.id) && !rejectedIds.includes(s.article.id)
      );
      
      // Ordenar por score (maior primeiro) e pegar top 5
      const sorted = filtered.sort((a, b) => b.score - a.score).slice(0, 5);
      setSuggestions(sorted);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    }
  };

  const findIncompleteSeries = async (): Promise<DownloadSuggestion[]> => {
    const cachedArticles = await getAllCachedArticles();
    const suggestions: DownloadSuggestion[] = [];
    
    // Agrupar artigos em cache por série
    const seriesMap = new Map<string, string[]>();
    cachedArticles.forEach((article) => {
      if (article.series) {
        const existing = seriesMap.get(article.series) || [];
        seriesMap.set(article.series, [...existing, article.id]);
      }
    });
    
    // Para cada série, verificar se há artigos não baixados
    seriesMap.forEach((cachedIds, seriesId) => {
      const seriesArticles = ARTICLES.filter((a) => a.themeId === seriesId);
      const uncachedArticles = seriesArticles.filter((a) => !cachedIds.includes(a.id));
      
      if (uncachedArticles.length > 0 && cachedIds.length > 0) {
        // Série incompleta! Sugerir os artigos faltantes
        uncachedArticles.forEach((article) => {
          const completionPercentage = (cachedIds.length / seriesArticles.length) * 100;
          suggestions.push({
            article,
            reason: `Complete a série (${cachedIds.length}/${seriesArticles.length} artigos)`,
            score: 90 + completionPercentage / 10, // Score alto para séries quase completas
            type: "incomplete_series",
          });
        });
      }
    });
    
    return suggestions;
  };

  const findRelatedToBookmarks = async (): Promise<DownloadSuggestion[]> => {
    const bookmarks = await getAllBookmarks();
    const suggestions: DownloadSuggestion[] = [];
    
    if (bookmarks.length === 0) return suggestions;
    
    // Contar temas dos destaques
    const themeCount = new Map<string, number>();
    bookmarks.forEach((bookmark) => {
      const article = ARTICLES.find((a) => a.id === bookmark.articleId);
      if (article?.themeId) {
        themeCount.set(article.themeId, (themeCount.get(article.themeId) || 0) + 1);
      }
    });
    
    // Sugerir artigos dos temas mais destacados
    const sortedThemes = Array.from(themeCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 temas
    
    sortedThemes.forEach(([themeId, count]) => {
      const themeArticles = ARTICLES.filter((a) => a.themeId === themeId);
      themeArticles.forEach((article) => {
        suggestions.push({
          article,
          reason: `Relacionado aos seus ${count} destaques`,
          score: 70 + count * 5, // Score baseado em quantos destaques
          type: "related_bookmarks",
        });
      });
    });
    
    return suggestions;
  };

  const findPopularThemes = (): DownloadSuggestion[] => {
    const suggestions: DownloadSuggestion[] = [];
    
    if (history.length === 0) return suggestions;
    
    // Contar leituras por tema
    const themeCount = new Map<string, number>();
    history.forEach((entry) => {
      const article = ARTICLES.find((a) => a.id === entry.articleId);
      if (article?.themeId) {
        themeCount.set(article.themeId, (themeCount.get(article.themeId) || 0) + 1);
      }
    });
    
    // Sugerir artigos dos temas mais lidos
    const sortedThemes = Array.from(themeCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2); // Top 2 temas
    
    sortedThemes.forEach(([themeId, count]) => {
      const themeArticles = ARTICLES.filter((a) => a.themeId === themeId);
      // Sugerir apenas artigos não lidos
      const unreadArticles = themeArticles.filter(
        (a) => !history.some((h) => h.articleId === a.id)
      );
      
      unreadArticles.forEach((article) => {
        suggestions.push({
          article,
          reason: `Tema que você mais lê (${count} artigos)`,
          score: 60 + count * 3,
          type: "popular_theme",
        });
      });
    });
    
    return suggestions;
  };

  const findFavoriteAuthors = (): DownloadSuggestion[] => {
    const suggestions: DownloadSuggestion[] = [];
    
    if (history.length === 0) return suggestions;
    
    // Contar leituras por autor
    const authorCount = new Map<string, number>();
    history.forEach((entry) => {
      const article = ARTICLES.find((a) => a.id === entry.articleId);
      if (article?.authors) {
        article.authors.forEach((author) => {
          authorCount.set(author.name, (authorCount.get(author.name) || 0) + 1);
        });
      }
    });
    
    // Sugerir artigos dos autores favoritos
    const sortedAuthors = Array.from(authorCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2); // Top 2 autores
    
    sortedAuthors.forEach(([authorName, count]) => {
      const authorArticles = ARTICLES.filter((a) =>
        a.authors?.some((author) => author.name === authorName)
      );
      
      // Sugerir apenas artigos não lidos
      const unreadArticles = authorArticles.filter(
        (a) => !history.some((h) => h.articleId === a.id)
      );
      
      unreadArticles.forEach((article) => {
        suggestions.push({
          article,
          reason: `Autor favorito: ${authorName}`,
          score: 50 + count * 2,
          type: "favorite_author",
        });
      });
    });
    
    return suggestions;
  };

  const rejectSuggestion = async (articleId: string) => {
    try {
      const data = await AsyncStorage.getItem(REJECTED_SUGGESTIONS_KEY);
      const rejected: { id: string; rejectedAt: number }[] = data ? JSON.parse(data) : [];
      
      rejected.push({ id: articleId, rejectedAt: Date.now() });
      await AsyncStorage.setItem(REJECTED_SUGGESTIONS_KEY, JSON.stringify(rejected));
      
      setRejectedIds([...rejectedIds, articleId]);
      setSuggestions(suggestions.filter((s) => s.article.id !== articleId));
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
    }
  };

  const refreshSuggestions = async () => {
    setLoading(true);
    await loadRejectedSuggestions();
    await generateSuggestions();
    setLoading(false);
  };

  return {
    suggestions,
    loading,
    rejectSuggestion,
    refreshSuggestions,
  };
}
