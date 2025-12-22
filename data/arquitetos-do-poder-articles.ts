import type { Article } from "@/types";
import rockefellerArticle from "./rockefeller_article.json";
import jpmorganArticle from "./jpmorgan_article.json";
import conexoesArticle from "./conexoes_article.json";
import carnegieArticle from "./carnegie_article.json";

export const ARQUITETOS_DO_PODER_ARTICLES: Article[] = [
  rockefellerArticle as Article,
  jpmorganArticle as Article,
  conexoesArticle as Article,
  carnegieArticle as Article,
];
