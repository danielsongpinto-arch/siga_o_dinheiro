import { useMemo } from "react";
import { useReadingHistory } from "./use-reading-history";
import { useFavorites } from "./use-favorites";
import { ARTICLES } from "@/data/mock-data";
import { Article } from "@/types";

export function useRecommendations() {
  const { history } = useReadingHistory();
  const { favorites } = useFavorites();

  const recommendations = useMemo(() => {
    // Se não há histórico, retornar artigos mais recentes
    if (history.length === 0) {
      return ARTICLES.slice(0, 3);
    }

    // Calcular score de relevância para cada artigo não lido
    const readArticleIds = new Set(history.map((h) => h.articleId));
    const unreadArticles = ARTICLES.filter((article) => !readArticleIds.has(article.id));

    if (unreadArticles.length === 0) {
      return [];
    }

    // Analisar preferências do usuário
    const readArticles = ARTICLES.filter((article) => readArticleIds.has(article.id));
    const favoriteArticles = ARTICLES.filter((article) => favorites.includes(article.id));

    // Contar temas lidos e favoritos
    const themeCount: Record<string, number> = {};
    const favoriteThemeCount: Record<string, number> = {};

    readArticles.forEach((article) => {
      themeCount[article.themeId] = (themeCount[article.themeId] || 0) + 1;
    });

    favoriteArticles.forEach((article) => {
      favoriteThemeCount[article.themeId] = (favoriteThemeCount[article.themeId] || 0) + 2;
    });

    // Calcular tempo médio de leitura
    const avgReadingTime =
      history.reduce((sum, h) => sum + (h.readingTime || 0), 0) / history.length;

    // Calcular score para cada artigo não lido
    const scoredArticles = unreadArticles.map((article) => {
      let score = 0;

      // Score por tema preferido (0-10 pontos)
      const themeScore = (themeCount[article.themeId] || 0) * 2;
      const favoriteThemeScore = (favoriteThemeCount[article.themeId] || 0) * 3;
      score += Math.min(themeScore + favoriteThemeScore, 10);

      // Score por popularidade do tema (0-5 pontos)
      const themePopularity = (themeCount[article.themeId] || 0);
      const popularityScore = Math.min(themePopularity, 5);
      score += popularityScore;

      // Score por recência (0-3 pontos)
      const articleDate = new Date(article.date);
      const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(3 - daysSincePublished / 30, 0);
      score += recencyScore;

      // Bônus para artigos de autores já lidos (2 pontos)
      const hasReadSameAuthor = readArticles.some((read) =>
        read.authors.some((author) => article.authors.some((a) => a.name === author.name))
      );
      if (hasReadSameAuthor) {
        score += 2;
      }

      return { article, score };
    });

    // Ordenar por score e retornar top 3
    scoredArticles.sort((a, b) => b.score - a.score);
    return scoredArticles.slice(0, 3).map((item) => item.article);
  }, [history, favorites]);

  const getRecommendationReason = (article: Article): string => {
    const readArticleIds = new Set(history.map((h) => h.articleId));
    const readArticles = ARTICLES.filter((a) => readArticleIds.has(a.id));
    const favoriteArticles = ARTICLES.filter((a) => favorites.includes(a.id));

    // Verificar se é do mesmo tema de artigos favoritos
    const hasFavoriteInTheme = favoriteArticles.some((fav) => fav.themeId === article.themeId);
    if (hasFavoriteInTheme) {
      return "Baseado nos seus favoritos";
    }

    // Verificar se é do mesmo tema de artigos lidos
    const hasReadInTheme = readArticles.some((read) => read.themeId === article.themeId);
    if (hasReadInTheme) {
      return "Você leu artigos similares";
    }

    // Verificar se tem autor em comum
    const hasCommonAuthor = readArticles.some((read) =>
      read.authors.some((author) => article.authors.some((a) => a.name === author.name))
    );
    if (hasCommonAuthor) {
      return "Mesmo autor de artigos que você leu";
    }

    // Verificar se é recente
    const articleDate = new Date(article.date);
    const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) {
      return "Publicado recentemente";
    }

    return "Recomendado para você";
  };

  return {
    recommendations,
    getRecommendationReason,
  };
}
