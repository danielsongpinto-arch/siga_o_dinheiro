export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: "reading" | "engagement" | "exploration" | "special";
}

export const BADGES: Badge[] = [
  {
    id: "first_read",
    title: "Primeiro Passo",
    description: "Leia seu primeiro artigo",
    icon: "book.fill",
    requirement: 1,
    type: "reading",
  },
  {
    id: "reader_5",
    title: "Leitor Curioso",
    description: "Leia 5 artigos",
    icon: "book.fill",
    requirement: 5,
    type: "reading",
  },
  {
    id: "reader_10",
    title: "Leitor Dedicado",
    description: "Leia 10 artigos",
    icon: "book.fill",
    requirement: 10,
    type: "reading",
  },
  {
    id: "reader_all",
    title: "Leitor Completo",
    description: "Leia todos os artigos disponíveis",
    icon: "star.fill",
    requirement: 6,
    type: "reading",
  },
  {
    id: "explorer",
    title: "Explorador",
    description: "Leia artigos de todos os temas",
    icon: "map.fill",
    requirement: 6,
    type: "exploration",
  },
  {
    id: "commenter_5",
    title: "Participativo",
    description: "Faça 5 comentários",
    icon: "bubble.left.fill",
    requirement: 5,
    type: "engagement",
  },
  {
    id: "commenter_20",
    title: "Debatedor",
    description: "Faça 20 comentários",
    icon: "bubble.left.fill",
    requirement: 20,
    type: "engagement",
  },
  {
    id: "highlighter_10",
    title: "Marcador",
    description: "Salve 10 marcadores",
    icon: "bookmark.fill",
    requirement: 10,
    type: "engagement",
  },
  {
    id: "favorite_5",
    title: "Colecionador",
    description: "Favorite 5 artigos",
    icon: "heart.fill",
    requirement: 5,
    type: "engagement",
  },
  {
    id: "early_bird",
    title: "Madrugador",
    description: "Leia um artigo antes das 7h",
    icon: "sunrise.fill",
    requirement: 1,
    type: "special",
  },
  {
    id: "night_owl",
    title: "Coruja Noturna",
    description: "Leia um artigo depois das 23h",
    icon: "moon.stars.fill",
    requirement: 1,
    type: "special",
  },
  {
    id: "weekend_reader",
    title: "Leitor de Fim de Semana",
    description: "Leia 3 artigos no fim de semana",
    icon: "calendar",
    requirement: 3,
    type: "special",
  },
  {
    id: "reviewer",
    title: "Revisor Dedicado",
    description: "Revise 10 destaques antigos (30+ dias)",
    icon: "clock.fill",
    requirement: 10,
    type: "special",
  },
];
