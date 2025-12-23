import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";

import { BADGES, Badge } from "@/data/badges";
import { useReadingHistory } from "./use-reading-history";
import { useComments } from "./use-comments";
import { useHighlights } from "./use-highlights";
import { useFavorites } from "./use-favorites";
import { useReviewTracking } from "./use-review-tracking";
import { useShareTracking } from "./use-share-tracking";
import { ARTICLES, THEMES } from "@/data/mock-data";

const UNLOCKED_BADGES_KEY = "@siga_o_dinheiro:unlocked_badges";

export function useAchievements() {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { history } = useReadingHistory();
  const { highlights } = useHighlights();
  const { favorites } = useFavorites();
  const { reviewCount } = useReviewTracking();
  const { shareCount } = useShareTracking();

  useEffect(() => {
    loadUnlockedBadges();
  }, []);

  useEffect(() => {
    if (!loading) {
      checkAchievements();
    }
  }, [history, highlights, favorites, reviewCount, shareCount, loading]);

  const loadUnlockedBadges = async () => {
    try {
      const stored = await AsyncStorage.getItem(UNLOCKED_BADGES_KEY);
      if (stored) {
        setUnlockedBadges(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading unlocked badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockBadge = async (badgeId: string) => {
    if (unlockedBadges.includes(badgeId)) return;

    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    try {
      const updated = [...unlockedBadges, badgeId];
      await AsyncStorage.setItem(UNLOCKED_BADGES_KEY, JSON.stringify(updated));
      setUnlockedBadges(updated);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        "🎉 Conquista Desbloqueada!",
        `${badge.title}\n${badge.description}`,
        [{ text: "Legal!", style: "default" }]
      );
    } catch (error) {
      console.error("Error unlocking badge:", error);
    }
  };

  const checkAchievements = async () => {
    // Leitura
    const articlesRead = history.length;
    if (articlesRead >= 1 && !unlockedBadges.includes("first_read")) {
      await unlockBadge("first_read");
    }
    if (articlesRead >= 5 && !unlockedBadges.includes("reader_5")) {
      await unlockBadge("reader_5");
    }
    if (articlesRead >= 10 && !unlockedBadges.includes("reader_10")) {
      await unlockBadge("reader_10");
    }
    if (articlesRead >= ARTICLES.length && !unlockedBadges.includes("reader_all")) {
      await unlockBadge("reader_all");
    }

    // Exploração
    const uniqueThemes = new Set(
      history.map((h) => {
        const article = ARTICLES.find((a) => a.id === h.articleId);
        return article?.themeId;
      })
    );
    if (uniqueThemes.size >= THEMES.length && !unlockedBadges.includes("explorer")) {
      await unlockBadge("explorer");
    }

    // Marcadores
    if (highlights.length >= 10 && !unlockedBadges.includes("highlighter_10")) {
      await unlockBadge("highlighter_10");
    }

    // Favoritos
    if (favorites.length >= 5 && !unlockedBadges.includes("favorite_5")) {
      await unlockBadge("favorite_5");
    }

    // Horários especiais
    const now = new Date();
    const hour = now.getHours();
    if (hour < 7 && articlesRead > 0 && !unlockedBadges.includes("early_bird")) {
      await unlockBadge("early_bird");
    }
    if (hour >= 23 && articlesRead > 0 && !unlockedBadges.includes("night_owl")) {
      await unlockBadge("night_owl");
    }

    // Fim de semana
    const day = now.getDay();
    if ((day === 0 || day === 6)) {
      const weekendReads = history.filter((h) => {
        const readDate = new Date(h.readAt);
        const readDay = readDate.getDay();
        return readDay === 0 || readDay === 6;
      }).length;
      if (weekendReads >= 3 && !unlockedBadges.includes("weekend_reader")) {
        await unlockBadge("weekend_reader");
      }
    }

    // Revisor Dedicado
    if (reviewCount >= 10 && !unlockedBadges.includes("reviewer")) {
      await unlockBadge("reviewer");
    }

    // Compartilhamentos
    if (shareCount >= 10 && !unlockedBadges.includes("influencer")) {
      await unlockBadge("influencer");
    }
    if (shareCount >= 50 && !unlockedBadges.includes("broadcaster")) {
      await unlockBadge("broadcaster");
    }
  };

  const getBadgeProgress = (badge: Badge): number => {
    switch (badge.id) {
      case "first_read":
      case "reader_5":
      case "reader_10":
      case "reader_all":
        return Math.min(history.length, badge.requirement);
      
      case "explorer": {
        const uniqueThemes = new Set(
          history.map((h) => {
            const article = ARTICLES.find((a) => a.id === h.articleId);
            return article?.themeId;
          })
        );
        return uniqueThemes.size;
      }
      
      case "highlighter_10":
        return Math.min(highlights.length, badge.requirement);
      
      case "favorite_5":
        return Math.min(favorites.length, badge.requirement);
      
      case "early_bird":
      case "night_owl":
        return unlockedBadges.includes(badge.id) ? 1 : 0;
      
      case "weekend_reader": {
        const weekendReads = history.filter((h) => {
          const readDate = new Date(h.readAt);
          const readDay = readDate.getDay();
          return readDay === 0 || readDay === 6;
        }).length;
        return Math.min(weekendReads, badge.requirement);
      }
      
      case "reviewer":
        return Math.min(reviewCount, badge.requirement);
      
      case "influencer":
      case "broadcaster":
        return Math.min(shareCount, badge.requirement);
      
      default:
        return 0;
    }
  };

  const isBadgeUnlocked = (badgeId: string): boolean => {
    return unlockedBadges.includes(badgeId);
  };

  return {
    unlockedBadges,
    loading,
    isBadgeUnlocked,
    getBadgeProgress,
    checkAchievements,
  };
}
