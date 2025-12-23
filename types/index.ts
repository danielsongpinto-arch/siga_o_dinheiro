export interface Theme {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  articleCount: number;
}

export interface Author {
  name: string;
  role: string;
  financialInterest: string;
}

export interface FinancialCycle {
  inicio: string;
  meio: string;
  fim: string;
}

export interface Article {
  id: string;
  themeId: string;
  title: string;
  date: string;
  content: string;
  articleAuthor?: string; // Autor do artigo (ex: "DGP")
  authors: Author[]; // Atores financeiros da história
  financialCycle: FinancialCycle;
  summary: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  date: string;
}

export interface UserStats {
  articlesRead: number;
  commentsPosted: number;
  favoriteCount: number;
}
