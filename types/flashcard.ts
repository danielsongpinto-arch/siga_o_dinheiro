export interface Flashcard {
  id: string;
  articleId: string;
  front: string;
  back: string;
  category: "autor" | "interesse" | "ciclo" | "conceito";
}

export interface FlashcardProgress {
  flashcardId: string;
  lastReviewed: string;
  nextReview: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  correct: number;
  incorrect: number;
}
