import { useState, useEffect } from "react";
import * as Calendar from "expo-calendar";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CALENDAR_PERMISSION_KEY = "@calendar_permission_granted";
const CALENDAR_ID_KEY = "@siga_o_dinheiro_calendar_id";

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  recurrenceRule?: string; // Ex: "FREQ=DAILY;INTERVAL=1"
  alarms?: number[]; // Minutos antes do evento
}

export function useCalendarIntegration() {
  const [hasPermission, setHasPermission] = useState(false);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermission();
    loadCalendarId();
  }, []);

  const checkPermission = async () => {
    try {
      const granted = await AsyncStorage.getItem(CALENDAR_PERMISSION_KEY);
      if (granted === "true") {
        const { status } = await Calendar.getCalendarPermissionsAsync();
        setHasPermission(status === "granted");
      }
    } catch (error) {
      console.error("[CalendarIntegration] Check permission failed:", error);
    }
  };

  const loadCalendarId = async () => {
    try {
      const id = await AsyncStorage.getItem(CALENDAR_ID_KEY);
      setCalendarId(id);
    } catch (error) {
      console.error("[CalendarIntegration] Load calendar ID failed:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      
      if (granted) {
        await AsyncStorage.setItem(CALENDAR_PERMISSION_KEY, "true");
        await getOrCreateCalendar();
      }
      
      return granted;
    } catch (error) {
      console.error("[CalendarIntegration] Request permission failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateCalendar = async (): Promise<string | null> => {
    try {
      // Tentar carregar calendário existente
      if (calendarId) {
        try {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const calendar = calendars.find((c) => c.id === calendarId);
          if (calendar) return calendarId;
        } catch {
          // Calendário não existe mais, criar novo
        }
      }

      // Criar novo calendário
      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: "Siga o Dinheiro", type: Calendar.SourceType.LOCAL };

      if (!defaultCalendarSource) {
        console.error("[CalendarIntegration] No default calendar source found");
        return null;
      }

      const newCalendarId = await Calendar.createCalendarAsync({
        title: "Siga o Dinheiro",
        color: "#D4AF37",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "siga_o_dinheiro",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      await AsyncStorage.setItem(CALENDAR_ID_KEY, newCalendarId);
      setCalendarId(newCalendarId);
      return newCalendarId;
    } catch (error) {
      console.error("[CalendarIntegration] Get or create calendar failed:", error);
      return null;
    }
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(
      (cal) => cal.source.name === "Default" || cal.source.name === "iCloud"
    );
    return defaultCalendar?.source || calendars[0]?.source;
  };

  const addEvent = async (event: CalendarEvent): Promise<string | null> => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permissão Negada",
            "É necessário permitir o acesso ao calendário para adicionar eventos."
          );
          return null;
        }
      }

      const targetCalendarId = calendarId || (await getOrCreateCalendar());
      if (!targetCalendarId) {
        Alert.alert("Erro", "Não foi possível acessar o calendário.");
        return null;
      }

      const eventId = await Calendar.createEventAsync(targetCalendarId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        timeZone: "America/Sao_Paulo",
        alarms: event.alarms?.map((minutes) => ({ relativeOffset: -minutes })),
      });

      return eventId;
    } catch (error) {
      console.error("[CalendarIntegration] Add event failed:", error);
      Alert.alert("Erro", "Falha ao adicionar evento ao calendário.");
      return null;
    }
  };

  const addRecurringEvent = async (event: CalendarEvent): Promise<string | null> => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permissão Negada",
            "É necessário permitir o acesso ao calendário para adicionar eventos."
          );
          return null;
        }
      }

      const targetCalendarId = calendarId || (await getOrCreateCalendar());
      if (!targetCalendarId) {
        Alert.alert("Erro", "Não foi possível acessar o calendário.");
        return null;
      }

      const eventId = await Calendar.createEventAsync(targetCalendarId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        timeZone: "America/Sao_Paulo",
        alarms: event.alarms?.map((minutes) => ({ relativeOffset: -minutes })),
        recurrenceRule: {
          frequency: Calendar.Frequency.DAILY,
          interval: 1,
        },
      });

      return eventId;
    } catch (error) {
      console.error("[CalendarIntegration] Add recurring event failed:", error);
      Alert.alert("Erro", "Falha ao adicionar evento recorrente ao calendário.");
      return null;
    }
  };

  const exportToICS = (event: CalendarEvent): string => {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    let ics = "BEGIN:VCALENDAR\n";
    ics += "VERSION:2.0\n";
    ics += "PRODID:-//Siga o Dinheiro//PT\n";
    ics += "BEGIN:VEVENT\n";
    ics += `UID:${Date.now()}@sigaodinheiro.app\n`;
    ics += `DTSTAMP:${formatDate(new Date())}\n`;
    ics += `DTSTART:${formatDate(event.startDate)}\n`;
    ics += `DTEND:${formatDate(event.endDate)}\n`;
    ics += `SUMMARY:${event.title}\n`;
    if (event.notes) {
      ics += `DESCRIPTION:${event.notes.replace(/\n/g, "\\n")}\n`;
    }
    if (event.recurrenceRule) {
      ics += `RRULE:${event.recurrenceRule}\n`;
    }
    if (event.alarms) {
      event.alarms.forEach((minutes) => {
        ics += "BEGIN:VALARM\n";
        ics += "ACTION:DISPLAY\n";
        ics += `TRIGGER:-PT${minutes}M\n`;
        ics += "END:VALARM\n";
      });
    }
    ics += "END:VEVENT\n";
    ics += "END:VCALENDAR";

    return ics;
  };

  return {
    hasPermission,
    loading,
    requestPermission,
    addEvent,
    addRecurringEvent,
    exportToICS,
  };
}
