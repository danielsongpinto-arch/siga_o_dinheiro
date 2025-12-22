import type { Article } from "@/types";
import sistemaArticle from "./sistema_autoperpetuante_article.json";
import bricsArticle from "./brics_article.json";

export const SISTEMA_AUTOPERPETUANTE_ARTICLES: Article[] = [
  sistemaArticle as Article,
  bricsArticle as Article,
];
