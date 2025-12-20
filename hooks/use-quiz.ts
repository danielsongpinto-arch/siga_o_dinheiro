import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuizResult, QuizStats } from "@/types/quiz";
import { QUIZ_QUESTIONS } from "@/data/quiz-data";

const QUIZ_RESULTS_KEY = "@siga_o_dinheiro:quiz_results";

export function useQuiz() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading quiz results:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveResults = async (newResults: QuizResult[]) => {
    try {
      await AsyncStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(newResults));
      setResults(newResults);
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  const saveQuizResult = async (result: QuizResult) => {
    // Remover resultado anterior do mesmo artigo se existir
    const filteredResults = results.filter((r) => r.articleId !== result.articleId);
    const newResults = [...filteredResults, result];
    await saveResults(newResults);
  };

  const getQuizForArticle = (articleId: string) => {
    return QUIZ_QUESTIONS.filter((q) => q.articleId === articleId);
  };

  const getResultForArticle = (articleId: string): QuizResult | undefined => {
    return results.find((r) => r.articleId === articleId);
  };

  const hasCompletedQuiz = (articleId: string): boolean => {
    return results.some((r) => r.articleId === articleId);
  };

  const getQuizStats = (): QuizStats => {
    if (results.length === 0) {
      return {
        totalQuizzesTaken: 0,
        averageScore: 0,
        perfectScores: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
      };
    }

    const totalQuizzesTaken = results.length;
    const perfectScores = results.filter((r) => r.score === r.totalQuestions).length;
    const totalQuestionsAnswered = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const correctAnswers = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round((correctAnswers / totalQuestionsAnswered) * 100);

    return {
      totalQuizzesTaken,
      averageScore,
      perfectScores,
      totalQuestionsAnswered,
      correctAnswers,
    };
  };

  const getScorePercentage = (articleId: string): number => {
    const result = getResultForArticle(articleId);
    if (!result) return 0;
    return Math.round((result.score / result.totalQuestions) * 100);
  };

  return {
    results,
    loading,
    saveQuizResult,
    getQuizForArticle,
    getResultForArticle,
    hasCompletedQuiz,
    getQuizStats,
    getScorePercentage,
  };
}
