import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "reading_activity_log";

export interface ReadingActivity {
  timestamp: number; // Unix timestamp
  action: "read" | "bookmark" | "note"; // Tipo de ação
}

export interface HeatmapData {
  day: number; // 0-6 (0 = Sunday)
  hour: number; // 0-23
  count: number; // Número de atividades
}

export function useReadingPatterns() {
  const [activities, setActivities] = useState<ReadingActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading reading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: ReadingActivity["action"]) => {
    try {
      const newActivity: ReadingActivity = {
        timestamp: Date.now(),
        action,
      };

      const updated = [...activities, newActivity];
      
      // Manter apenas últimos 1000 registros para não sobrecarregar
      const trimmed = updated.slice(-1000);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setActivities(trimmed);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const getHeatmapData = (): HeatmapData[] => {
    // Criar matriz 7 dias x 24 horas
    const heatmap: { [key: string]: number } = {};
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmap[`${day}-${hour}`] = 0;
      }
    }

    // Contar atividades por dia da semana e hora
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const day = date.getDay(); // 0-6
      const hour = date.getHours(); // 0-23
      const key = `${day}-${hour}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    // Converter para array
    const data: HeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          day,
          hour,
          count: heatmap[`${day}-${hour}`] || 0,
        });
      }
    }

    return data;
  };

  const getPeakTime = (): { day: number; hour: number; count: number } | null => {
    const heatmapData = getHeatmapData();
    if (heatmapData.length === 0) return null;

    let peak = heatmapData[0];
    heatmapData.forEach((cell) => {
      if (cell.count > peak.count) {
        peak = cell;
      }
    });

    return peak.count > 0 ? peak : null;
  };

  const getTotalActivities = (): number => {
    return activities.length;
  };

  const getActivitiesByType = (): Record<ReadingActivity["action"], number> => {
    const counts: Record<ReadingActivity["action"], number> = {
      read: 0,
      bookmark: 0,
      note: 0,
    };

    activities.forEach((activity) => {
      counts[activity.action]++;
    });

    return counts;
  };

  return {
    activities,
    loading,
    logActivity,
    getHeatmapData,
    getPeakTime,
    getTotalActivities,
    getActivitiesByType,
  };
}
