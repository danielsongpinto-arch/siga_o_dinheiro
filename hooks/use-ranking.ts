import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useReadingHistory } from "./use-reading-history";
import { useAchievements } from "./use-achievements";
import { useComments } from "./use-comments";
import { useHighlights } from "./use-highlights";

const USER_SCORE_KEY = "@siga_o_dinheiro:user_score";
const LEADERBOARD_KEY = "@siga_o_dinheiro:leaderboard";

export interface UserScore {
  userId: string;
  userName: string;
  score: number;
  articlesRead: number;
  badgesUnlocked: number;
  commentsCount: number;
  highlightsCount: number;
  lastUpdated: string;
}

export function useRanking(userId?: string) {
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { history } = useReadingHistory();
  const { unlockedBadges } = useAchievements();
  const { highlights } = useHighlights();

  useEffect(() => {
    loadUserScore();
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (userId) {
      updateUserScore();
    }
  }, [history, unlockedBadges, highlights]);

  const calculateScore = (): number => {
    let score = 0;
    
    // Pontos por artigos lidos (10 pontos cada)
    score += history.length * 10;
    
    // Pontos por badges desbloqueados (50 pontos cada)
    score += unlockedBadges.length * 50;
    
    // Pontos por marcadores (5 pontos cada)
    score += highlights.length * 5;
    
    // Bônus por completar todos os artigos (100 pontos)
    if (history.length >= 6) {
      score += 100;
    }
    
    // Bônus por desbloquear todos os badges (200 pontos)
    if (unlockedBadges.length >= 12) {
      score += 200;
    }
    
    return score;
  };

  const loadUserScore = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_SCORE_KEY);
      if (stored) {
        setUserScore(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading user score:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const stored = await AsyncStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        const board = JSON.parse(stored) as UserScore[];
        const sorted = board.sort((a, b) => b.score - a.score);
        setLeaderboard(sorted);
        
        if (userId) {
          const rank = sorted.findIndex((u) => u.userId === userId) + 1;
          setUserRank(rank);
        }
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  const updateUserScore = async () => {
    if (!userId) return;

    try {
      const score = calculateScore();
      
      const newUserScore: UserScore = {
        userId,
        userName: "Você", // Pode ser substituído pelo nome real do usuário
        score,
        articlesRead: history.length,
        badgesUnlocked: unlockedBadges.length,
        commentsCount: 0, // Seria calculado com hook de comentários global
        highlightsCount: highlights.length,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(USER_SCORE_KEY, JSON.stringify(newUserScore));
      setUserScore(newUserScore);

      // Atualizar leaderboard
      const stored = await AsyncStorage.getItem(LEADERBOARD_KEY);
      let board = stored ? JSON.parse(stored) : [];
      
      const existingIndex = board.findIndex((u: UserScore) => u.userId === userId);
      if (existingIndex !== -1) {
        board[existingIndex] = newUserScore;
      } else {
        board.push(newUserScore);
      }
      
      board.sort((a: UserScore, b: UserScore) => b.score - a.score);
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
      setLeaderboard(board);
      
      const rank = board.findIndex((u: UserScore) => u.userId === userId) + 1;
      setUserRank(rank);
    } catch (error) {
      console.error("Error updating user score:", error);
    }
  };

  const getRankBadge = (rank: number): string => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankTitle = (score: number): string => {
    if (score >= 1000) return "Mestre Analista";
    if (score >= 500) return "Analista Expert";
    if (score >= 250) return "Analista Avançado";
    if (score >= 100) return "Analista";
    if (score >= 50) return "Aprendiz";
    return "Iniciante";
  };

  return {
    userScore,
    leaderboard,
    userRank,
    loading,
    updateUserScore,
    getRankBadge,
    getRankTitle,
  };
}
