import { Article } from "@/types";

/**
 * Adiciona "DGP" como autor do artigo se não estiver definido
 */
export function addDGPAuthor(article: Article): Article {
  return {
    ...article,
    articleAuthor: article.articleAuthor || "DGP",
  };
}

/**
 * Adiciona "DGP" como autor em todos os artigos de um array
 */
export function addDGPAuthorToAll(articles: Article[]): Article[] {
  return articles.map(addDGPAuthor);
}

/**
 * Obtém o autor do artigo (DGP por padrão)
 */
export function getArticleAuthor(article: Article): string {
  return article.articleAuthor || "DGP";
}
