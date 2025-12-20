import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_ENABLED_KEY = "@siga_o_dinheiro:notifications_enabled";

// Configurar como as notificações devem ser tratadas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationPreference();
    registerForPushNotificationsAsync();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      if (enabled !== null) {
        setNotificationsEnabled(JSON.parse(enabled));
      }
    } catch (error) {
      console.error("Error loading notification preference:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(enabled));
      setNotificationsEnabled(enabled);

      if (enabled) {
        await registerForPushNotificationsAsync();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      // Obter token do Expo Push
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);

      // Configurar canal de notificação no Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#D4AF37",
        });
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  };

  const scheduleNewArticleNotification = async (articleTitle: string, themeTitle: string) => {
    if (!notificationsEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Novo Artigo Disponível! 📰",
          body: `${articleTitle} - ${themeTitle}`,
          data: { type: "new_article" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2, // Notificar após 2 segundos (para demonstração)
        },
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const scheduleWeeklyDigest = async () => {
    if (!notificationsEnabled) return;

    try {
      // Agendar notificação semanal (toda segunda-feira às 9h)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Resumo Semanal 📊",
          body: "Confira os novos artigos desta semana no Siga o Dinheiro",
          data: { type: "weekly_digest" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday: 2, // Segunda-feira (1 = domingo, 2 = segunda, etc.)
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Error scheduling weekly digest:", error);
    }
  };

  return {
    expoPushToken,
    notificationsEnabled,
    loading,
    toggleNotifications,
    scheduleNewArticleNotification,
    scheduleWeeklyDigest,
  };
}
