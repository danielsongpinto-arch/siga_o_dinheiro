import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

const STORAGE_KEY = "reading_goals";
const HISTORY_KEY = "reading_goals_history";

export interface ReadingGoal {
  type: "weekly" | "monthly";
  target: number; // Número de artigos
  current: number; // Progresso atual
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface GoalHistory {
  date: string;
  type: "weekly" | "monthly";
  target: number;
  achieved: number;
  completed: boolean;
}

export function useReadingGoals() {
  const [goal, setGoal] = useState<ReadingGoal | null>(null);
  const [history, setHistory] = useState<GoalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
    loadHistory();
  }, []);

  const loadGoal = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedGoal: ReadingGoal = JSON.parse(stored);
        
        // Verificar se a meta expirou
        const now = new Date();
        const endDate = new Date(loadedGoal.endDate);
        
        if (now > endDate) {
          // Salvar no histórico
          await saveToHistory(loadedGoal);
          // Criar nova meta automaticamente
          await createNewGoal(loadedGoal.type, loadedGoal.target);
        } else {
          setGoal(loadedGoal);
        }
      }
    } catch (error) {
      console.error("Error loading goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const createGoal = async (type: "weekly" | "monthly", target: number) => {
    try {
      const now = new Date();
      const startDate = now.toISOString();
      
      let endDate: Date;
      if (type === "weekly") {
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else {
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      }

      const newGoal: ReadingGoal = {
        type,
        target,
        current: 0,
        startDate,
        endDate: endDate.toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoal));
      setGoal(newGoal);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const createNewGoal = async (type: "weekly" | "monthly", target: number) => {
    await createGoal(type, target);
  };

  const incrementProgress = async () => {
    if (!goal) return;

    try {
      const updated: ReadingGoal = {
        ...goal,
        current: goal.current + 1,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setGoal(updated);

      // Verificar se atingiu a meta
      if (updated.current >= updated.target) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "🎉 Meta Atingida!",
          `Parabéns! Você completou sua meta de ${updated.target} artigos!`,
          [{ text: "OK" }]
        );
        
        // Agendar notificação
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🎉 Meta Atingida!",
            body: `Parabéns! Você completou sua meta de ${updated.target} artigos!`,
          },
          trigger: null, // Imediato
        });
      }
    } catch (error) {
      console.error("Error incrementing progress:", error);
    }
  };

  const saveToHistory = async (completedGoal: ReadingGoal) => {
    try {
      const historyItem: GoalHistory = {
        date: completedGoal.endDate,
        type: completedGoal.type,
        target: completedGoal.target,
        achieved: completedGoal.current,
        completed: completedGoal.current >= completedGoal.target,
      };

      const updated = [historyItem, ...history].slice(0, 50); // Manter últimos 50
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const deleteGoal = async () => {
    try {
      if (goal) {
        await saveToHistory(goal);
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
      setGoal(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const getProgress = (): number => {
    if (!goal) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysRemaining = (): number => {
    if (!goal) return 0;
    const now = new Date();
    const end = new Date(goal.endDate);
    const diffMs = end.getTime() - now.getTime();
    return Math.max(Math.ceil(diffMs / (24 * 60 * 60 * 1000)), 0);
  };

  const getCompletedGoalsCount = (): number => {
    return history.filter((h) => h.completed).length;
  };

  return {
    goal,
    history,
    loading,
    createGoal,
    incrementProgress,
    deleteGoal,
    getProgress,
    getDaysRemaining,
    getCompletedGoalsCount,
  };
}
