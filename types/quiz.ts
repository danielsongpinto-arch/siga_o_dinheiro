export interface QuizQuestion {
  id: string;
  articleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  articleId: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
  }[];
  completedAt: string;
}

export interface QuizStats {
  totalQuizzesTaken: number;
  averageScore: number;
  perfectScores: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
}
