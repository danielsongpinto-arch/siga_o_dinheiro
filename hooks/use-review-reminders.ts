import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { getAllBookmarks, type Bookmark } from "@/components/article-bookmarks";

const STORAGE_KEY = "review_reminders_settings";

export interface ReviewRemindersSettings {
  enabled: boolean;
  frequency: "weekly" | "biweekly" | "monthly";
  intervals: number[]; // Intervalos em dias (ex: [30, 60, 90])
  notificationIds: Record<number, string>; // Map de intervalo -> notificationId
}

const DEFAULT_SETTINGS: ReviewRemindersSettings = {
  enabled: false,
  frequency: "weekly",
  intervals: [30], // Padrão: apenas 30 dias
  notificationIds: {},
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

      // Cancelar notificações anteriores se existirem
      for (const notifId of Object.values(settings.notificationIds)) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notifId);
        } catch (error) {
          console.error("Error canceling notification:", error);
        }
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

      // Agendar notificações para cada intervalo configurado
      const newNotificationIds: Record<number, string> = {};
      
      for (const interval of settings.intervals) {
        const oldBookmarks = await getOldBookmarks(interval);
        const count = oldBookmarks.length;

        if (count > 0) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "📚 Hora de Revisar seus Destaques",
              body: `Você tem ${count} ${count === 1 ? "destaque" : "destaques"} de ${interval}+ dias atrás para revisar`,
              data: { type: "review_reminder", interval },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: intervalSeconds,
              repeats: true,
            } as Notifications.TimeIntervalTriggerInput,
          });
          
          newNotificationIds[interval] = notificationId;
        }
      }

      return newNotificationIds;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  };

  const enableReminders = async (frequency: "weekly" | "biweekly" | "monthly") => {
    const notificationIds = await scheduleNotification();
    
    const newSettings: ReviewRemindersSettings = {
      enabled: true,
      frequency,
      intervals: settings.intervals,
      notificationIds: notificationIds || {},
    };

    await saveSettings(newSettings);
  };

  const disableReminders = async () => {
    // Cancelar notificações agendadas
    for (const notifId of Object.values(settings.notificationIds)) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notifId);
      } catch (error) {
        console.error("Error canceling notification:", error);
      }
    }

    const newSettings: ReviewRemindersSettings = {
      enabled: false,
      frequency: settings.frequency,
      intervals: settings.intervals,
      notificationIds: {},
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
        intervals: settings.intervals,
        notificationIds: notificationId || settings.notificationIds,
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

  const updateIntervals = async (intervals: number[]) => {
    if (settings.enabled) {
      // Reagendar com novos intervalos
      const notificationIds = await scheduleNotification();
      
      const newSettings: ReviewRemindersSettings = {
        enabled: true,
        frequency: settings.frequency,
        intervals,
        notificationIds: notificationIds || {},
      };

      await saveSettings(newSettings);
    } else {
      // Apenas atualizar intervalos sem agendar
      await saveSettings({
        ...settings,
        intervals,
      });
    }
  };

  const getOldBookmarksCounts = async () => {
    const counts: Record<number, number> = {};
    
    for (const interval of settings.intervals) {
      const bookmarks = await getOldBookmarks(interval);
      counts[interval] = bookmarks.length;
    }

    return counts;
  };

  return {
    settings,
    loading,
    enableReminders,
    disableReminders,
    updateFrequency,
    updateIntervals,
    getOldBookmarksCounts,
  };
}
