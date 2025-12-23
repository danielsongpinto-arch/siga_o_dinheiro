import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const STORAGE_KEY = "reading_reminders_config";

export interface ReadingRemindersConfig {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
  days: number[]; // 0-6 (0 = Sunday)
}

const DEFAULT_CONFIG: ReadingRemindersConfig = {
  enabled: false,
  hour: 19, // 19h
  minute: 0,
  days: [1, 2, 3, 4, 5], // Segunda a sexta
};

export function useReadingReminders() {
  const [config, setConfig] = useState<ReadingRemindersConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading reading reminders config:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: ReadingRemindersConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);

      // Reagendar notificações
      if (newConfig.enabled) {
        await scheduleReminders(newConfig);
      } else {
        await cancelReminders();
      }
    } catch (error) {
      console.error("Error saving reading reminders config:", error);
    }
  };

  const scheduleReminders = async (cfg: ReadingRemindersConfig) => {
    try {
      // Cancelar notificações existentes
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Solicitar permissão
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permission not granted");
        return;
      }

      // Agendar notificação para cada dia da semana selecionado
      for (const day of cfg.days) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Continue sua jornada! 📚",
            body: "Você tem artigos em progresso. Que tal continuar a leitura?",
            data: { screen: "themes" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: day + 1, // expo-notifications usa 1-7 (1 = Sunday)
            hour: cfg.hour,
            minute: cfg.minute,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      }

      console.log("Reading reminders scheduled successfully");
    } catch (error) {
      console.error("Error scheduling reminders:", error);
    }
  };

  const cancelReminders = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Reading reminders cancelled");
    } catch (error) {
      console.error("Error cancelling reminders:", error);
    }
  };

  const toggleEnabled = async () => {
    const newConfig = { ...config, enabled: !config.enabled };
    await saveConfig(newConfig);
  };

  const setTime = async (hour: number, minute: number) => {
    const newConfig = { ...config, hour, minute };
    await saveConfig(newConfig);
  };

  const setDays = async (days: number[]) => {
    const newConfig = { ...config, days };
    await saveConfig(newConfig);
  };

  return {
    config,
    loading,
    toggleEnabled,
    setTime,
    setDays,
    saveConfig,
  };
}
