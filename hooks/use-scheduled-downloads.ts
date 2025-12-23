import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import NetInfo from "@react-native-community/netinfo";
import { useBatchDownload } from "./use-batch-download";

const SCHEDULED_DOWNLOADS_KEY = "scheduled_downloads";

export interface ScheduledDownload {
  id: string;
  themeId: string;
  themeName: string;
  scheduledTime: string; // ISO string
  wifiOnly: boolean;
  notificationId?: string;
}

export function useScheduledDownloads() {
  const [scheduledDownloads, setScheduledDownloads] = useState<ScheduledDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const { downloadSeries } = useBatchDownload();

  // Carregar downloads agendados
  useEffect(() => {
    loadScheduledDownloads();
  }, []);

  const loadScheduledDownloads = async () => {
    try {
      const data = await AsyncStorage.getItem(SCHEDULED_DOWNLOADS_KEY);
      if (data) {
        const downloads: ScheduledDownload[] = JSON.parse(data);
        // Filtrar downloads expirados
        const now = new Date().getTime();
        const active = downloads.filter((d) => new Date(d.scheduledTime).getTime() > now);
        setScheduledDownloads(active);
        
        // Salvar lista filtrada
        if (active.length !== downloads.length) {
          await AsyncStorage.setItem(SCHEDULED_DOWNLOADS_KEY, JSON.stringify(active));
        }
      }
    } catch (error) {
      console.error("Error loading scheduled downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleDownload = async (
    themeId: string,
    themeName: string,
    scheduledTime: Date,
    wifiOnly: boolean = true
  ): Promise<boolean> => {
    try {
      const id = `${themeId}_${Date.now()}`;
      
      // Calcular segundos até o horário agendado
      const now = new Date().getTime();
      const scheduledMs = scheduledTime.getTime();
      const secondsUntil = Math.floor((scheduledMs - now) / 1000);

      if (secondsUntil <= 0) {
        console.error("Scheduled time must be in the future");
        return false;
      }

      // Agendar notificação
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Agendado",
          body: `Iniciando download da série "${themeName}"`,
          data: { themeId, scheduledDownloadId: id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntil,
        } as Notifications.TimeIntervalTriggerInput,
      });

      // Salvar agendamento
      const newDownload: ScheduledDownload = {
        id,
        themeId,
        themeName,
        scheduledTime: scheduledTime.toISOString(),
        wifiOnly,
        notificationId,
      };

      const updated = [...scheduledDownloads, newDownload];
      setScheduledDownloads(updated);
      await AsyncStorage.setItem(SCHEDULED_DOWNLOADS_KEY, JSON.stringify(updated));

      return true;
    } catch (error) {
      console.error("Error scheduling download:", error);
      return false;
    }
  };

  const cancelScheduledDownload = async (id: string): Promise<boolean> => {
    try {
      const download = scheduledDownloads.find((d) => d.id === id);
      if (!download) return false;

      // Cancelar notificação
      if (download.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(download.notificationId);
      }

      // Remover agendamento
      const updated = scheduledDownloads.filter((d) => d.id !== id);
      setScheduledDownloads(updated);
      await AsyncStorage.setItem(SCHEDULED_DOWNLOADS_KEY, JSON.stringify(updated));

      return true;
    } catch (error) {
      console.error("Error canceling scheduled download:", error);
      return false;
    }
  };

  const executeScheduledDownload = async (scheduledDownloadId: string) => {
    try {
      const download = scheduledDownloads.find((d) => d.id === scheduledDownloadId);
      if (!download) return;

      // Verificar conexão se wifiOnly
      if (download.wifiOnly) {
        const netInfo = await NetInfo.fetch();
        if (netInfo.type !== "wifi") {
          console.log("Skipping download: not on Wi-Fi");
          
          // Notificar usuário
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Download Cancelado",
              body: `Download de "${download.themeName}" requer Wi-Fi`,
            },
            trigger: null,
          });
          
          // Remover agendamento
          await cancelScheduledDownload(download.id);
          return;
        }
      }

      // Executar download
      await downloadSeries(download.themeId);

      // Notificar conclusão
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Concluído",
          body: `Série "${download.themeName}" baixada com sucesso`,
        },
        trigger: null,
      });

      // Remover agendamento
      await cancelScheduledDownload(download.id);
    } catch (error) {
      console.error("Error executing scheduled download:", error);
    }
  };

  return {
    scheduledDownloads,
    loading,
    scheduleDownload,
    cancelScheduledDownload,
    executeScheduledDownload,
  };
}
