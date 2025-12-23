import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { getAllBookmarks, type Bookmark } from "@/components/article-bookmarks";

const STORAGE_KEY = "review_reminders_settings";

export interface ReviewRemindersSettings {
  enabled: boolean;
  frequency: "weekly" | "biweekly" | "monthly";
  notificationId?: string;
}

const DEFAULT_SETTINGS: ReviewRemindersSettings = {
  enabled: false,
  frequency: "weekly",
};

export function useReviewReminders() {
  const [settings, setSettings] = useState<ReviewRemindersSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading review reminders settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: ReviewRemindersSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving review reminders settings:", error);
    }
  };

  const getOldBookmarks = async (daysAgo: number): Promise<Bookmark[]> => {
    try {
      const allBookmarks = await getAllBookmarks();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      return allBookmarks.filter((bookmark) => {
        const bookmarkDate = new Date(bookmark.createdAt);
        return bookmarkDate < cutoffDate;
      });
    } catch (error) {
      console.error("Error getting old bookmarks:", error);
      return [];
    }
  };

  const scheduleNotification = async () => {
    try {
      // Solicitar permissão
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted");
        return null;
      }

      // Cancelar notificação anterior se existir
      if (settings.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(settings.notificationId);
      }

      // Calcular intervalo em segundos
      let intervalSeconds: number;
      switch (settings.frequency) {
        case "weekly":
          intervalSeconds = 7 * 24 * 60 * 60; // 7 dias
          break;
        case "biweekly":
          intervalSeconds = 14 * 24 * 60 * 60; // 14 dias
          break;
        case "monthly":
          intervalSeconds = 30 * 24 * 60 * 60; // 30 dias
          break;
        default:
          intervalSeconds = 7 * 24 * 60 * 60;
      }

      // Contar destaques antigos (30+ dias)
      const oldBookmarks = await getOldBookmarks(30);
      const count = oldBookmarks.length;

      if (count === 0) {
        console.log("No old bookmarks to review");
        return null;
      }

      // Agendar notificação recorrente
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Hora de Revisar seus Destaques",
          body: `Você tem ${count} ${count === 1 ? "destaque" : "destaques"} de mais de 30 dias atrás para revisar`,
          data: { type: "review_reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: intervalSeconds,
          repeats: true,
        } as Notifications.TimeIntervalTriggerInput,
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  };

  const enableReminders = async (frequency: "weekly" | "biweekly" | "monthly") => {
    const notificationId = await scheduleNotification();
    
    const newSettings: ReviewRemindersSettings = {
      enabled: true,
      frequency,
      notificationId: notificationId || undefined,
    };

    await saveSettings(newSettings);
  };

  const disableReminders = async () => {
    // Cancelar notificação agendada
    if (settings.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(settings.notificationId);
      } catch (error) {
        console.error("Error canceling notification:", error);
      }
    }

    const newSettings: ReviewRemindersSettings = {
      enabled: false,
      frequency: settings.frequency,
    };

    await saveSettings(newSettings);
  };

  const updateFrequency = async (frequency: "weekly" | "biweekly" | "monthly") => {
    if (settings.enabled) {
      // Reagendar com nova frequência
      const notificationId = await scheduleNotification();
      
      const newSettings: ReviewRemindersSettings = {
        enabled: true,
        frequency,
        notificationId: notificationId || settings.notificationId,
      };

      await saveSettings(newSettings);
    } else {
      // Apenas atualizar frequência sem agendar
      await saveSettings({
        ...settings,
        frequency,
      });
    }
  };

  const getOldBookmarksCounts = async () => {
    const thirtyDays = await getOldBookmarks(30);
    const sixtyDays = await getOldBookmarks(60);
    const ninetyDays = await getOldBookmarks(90);

    return {
      thirtyDays: thirtyDays.length,
      sixtyDays: sixtyDays.length,
      ninetyDays: ninetyDays.length,
    };
  };

  return {
    settings,
    loading,
    enableReminders,
    disableReminders,
    updateFrequency,
    getOldBookmarksCounts,
  };
}
