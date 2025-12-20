import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashcardProgress } from "@/types/flashcard";
import { FLASHCARDS } from "@/data/flashcard-data";

const PROGRESS_KEY = "siga_o_dinheiro_flashcard_progress";

export function useFlashcards(articleId?: string) {
  const [progress, setProgress] = useState<Record<string, FlashcardProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      if (data) {
        setProgress(JSON.parse(data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      setLoading(false);
    }
  };

  const getFlashcards = () => {
    return articleId ? FLASHCARDS.filter((fc) => fc.articleId === articleId) : FLASHCARDS;
  };

  const getDueFlashcards = () => {
    const now = new Date();
    const flashcards = getFlashcards();
    
    return flashcards.filter((fc) => {
      const prog = progress[fc.id];
      if (!prog) return true; // Nunca revisado
      return new Date(prog.nextReview) <= now;
    });
  };

  const recordAnswer = async (flashcardId: string, correct: boolean) => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress = data ? JSON.parse(data) : {};
      
      const current = allProgress[flashcardId] || {
        flashcardId,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date().toISOString(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        correct: 0,
        incorrect: 0,
      };

      // Algoritmo SM-2 simplificado para revisão espaçada
      let newEaseFactor = current.easeFactor;
      let newInterval = current.interval;
      let newRepetitions = current.repetitions;

      if (correct) {
        newRepetitions += 1;
        current.correct += 1;

        if (newRepetitions === 1) {
          newInterval = 1; // 1 dia
        } else if (newRepetitions === 2) {
          newInterval = 6; // 6 dias
        } else {
          newInterval = Math.round(current.interval * current.easeFactor);
        }

        newEaseFactor = current.easeFactor + (0.1 - (5 - 5) * (0.08 + (5 - 5) * 0.02));
      } else {
        newRepetitions = 0;
        newInterval = 1;
        current.incorrect += 1;
        newEaseFactor = Math.max(1.3, current.easeFactor - 0.2);
      }

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

      const updated: FlashcardProgress = {
        ...current,
        lastReviewed: new Date().toISOString(),
        nextReview: nextReviewDate.toISOString(),
        easeFactor: newEaseFactor,
        interval: newInterval,
        repetitions: newRepetitions,
      };

      allProgress[flashcardId] = updated;
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      await loadProgress();
    } catch (error) {
      console.error("Erro ao registrar resposta:", error);
      throw error;
    }
  };

  const getStats = () => {
    const flashcards = getFlashcards();
    const totalCards = flashcards.length;
    const reviewedCards = flashcards.filter((fc) => progress[fc.id]).length;
    const dueCards = getDueFlashcards().length;

    let totalCorrect = 0;
    let totalIncorrect = 0;

    flashcards.forEach((fc) => {
      const prog = progress[fc.id];
      if (prog) {
        totalCorrect += prog.correct;
        totalIncorrect += prog.incorrect;
      }
    });

    const accuracy = totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;

    return {
      totalCards,
      reviewedCards,
      dueCards,
      accuracy,
      totalCorrect,
      totalIncorrect,
    };
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(PROGRESS_KEY);
      setProgress({});
    } catch (error) {
      console.error("Erro ao resetar progresso:", error);
      throw error;
    }
  };

  return {
    flashcards: getFlashcards(),
    dueFlashcards: getDueFlashcards(),
    progress,
    loading,
    recordAnswer,
    getStats,
    resetProgress,
  };
}
