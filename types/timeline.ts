export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  description: string;
  articleId?: string;
  themeId: string;
  keyPlayers: string[];
  financialImpact: string;
  icon: string;
}

export interface TimelinePeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
}
