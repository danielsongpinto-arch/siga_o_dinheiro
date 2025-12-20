export interface Series {
  id: string;
  title: string;
  description: string;
  themeId: string;
  articleIds: string[];
  totalParts: number;
  imageUrl?: string;
}

export interface SeriesProgress {
  seriesId: string;
  completedArticleIds: string[];
  currentPartIndex: number;
  completedAt?: string;
}
