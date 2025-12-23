import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

/**
 * Hook para sincronizar configurações do usuário entre dispositivos via backend.
 * 
 * Sincroniza:
 * - Tema (claro/escuro/automático)
 * - Tamanho de fonte
 * - Espaçamento de linha
 * - Lembretes de leitura (horários)
 * - Metas de leitura
 * - Todas as preferências do usuário
 * 
 * Funciona similar ao useBookmarkSync, mas para configurações.
 */

export interface UserSettings {
  // Tema
  themePreference?: "light" | "dark" | "auto";
  
  // Leitura
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl";
  lineSpacing?: "compact" | "normal" | "expanded";
  
  // Lembretes
  readingRemindersEnabled?: boolean;
  readingReminderTime?: string; // "HH:MM"
  readingReminderDays?: number[]; // [1,2,3,4,5] = seg-sex
  
  // Metas
  readingGoalType?: "weekly" | "monthly";
  readingGoalTarget?: number;
  
  // Modo Noturno
  nightModeEnabled?: boolean;
  
  // Última atualização (para resolver conflitos)
  updatedAt?: number;
}

const SETTINGS_KEY = "user_settings_v1";
const SYNC_ENABLED_KEY = "settings_sync_enabled";

export function useSettingsSync() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [settings, setSettings] = useState<UserSettings>({});

  const syncSettings = trpc.settings.sync.useMutation();
  const getSettings = trpc.settings.get.useQuery(undefined, {
    enabled: syncEnabled,
  });

  // Carregar estado de sincronização ao montar
  useEffect(() => {
    loadSyncState();
  }, []);

  // Carregar configurações locais ao montar
  useEffect(() => {
    loadLocalSettings();
  }, []);

  // Sincronizar automaticamente quando ativar sync
  useEffect(() => {
    if (syncEnabled && !isSyncing) {
      performSync();
    }
  }, [syncEnabled]);

  const loadSyncState = async () => {
    try {
      const enabled = await AsyncStorage.getItem(SYNC_ENABLED_KEY);
      setSyncEnabled(enabled === "true");
      
      const lastSync = await AsyncStorage.getItem("settings_last_sync");
      if (lastSync) {
        setLastSyncTime(new Date(parseInt(lastSync)));
      }
    } catch (error) {
      console.error("[SettingsSync] Erro ao carregar estado:", error);
    }
  };

  const loadLocalSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        setSettings(JSON.parse(data));
      }
    } catch (error) {
      console.error("[SettingsSync] Erro ao carregar configurações locais:", error);
    }
  };

  const saveLocalSettings = async (newSettings: UserSettings) => {
    try {
      const updated = {
        ...newSettings,
        updatedAt: Date.now(),
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
      
      // Se sync ativado, enviar para servidor
      if (syncEnabled) {
        await syncToServer(updated);
      }
    } catch (error) {
      console.error("[SettingsSync] Erro ao salvar configurações:", error);
    }
  };

  const syncToServer = async (settingsData: UserSettings) => {
    try {
      await syncSettings.mutateAsync({
        settings: settingsData,
      });
      console.log("[SettingsSync] Sincronizado com servidor");
    } catch (error) {
      console.error("[SettingsSync] Erro ao sincronizar com servidor:", error);
    }
  };

  const toggleSync = async () => {
    const newValue = !syncEnabled;
    setSyncEnabled(newValue);
    await AsyncStorage.setItem(SYNC_ENABLED_KEY, newValue.toString());
    
    if (newValue) {
      // Ativar: fazer upload das configurações locais
      await performSync();
    }
  };

  const performSync = async () => {
    if (!syncEnabled) return;
    
    setIsSyncing(true);
    try {
      // 1. Carregar configurações locais
      const localData = await AsyncStorage.getItem(SETTINGS_KEY);
      const localSettings: UserSettings = localData ? JSON.parse(localData) : {};
      
      // 2. Enviar para servidor
      await syncSettings.mutateAsync({
        settings: localSettings,
      });
      
      // 3. Buscar configurações do servidor
      const serverSettings = await getSettings.refetch();
      
      // 4. Resolver conflitos (última modificação vence)
      if (serverSettings.data) {
        const serverTime = serverSettings.data.updatedAt || 0;
        const localTime = localSettings.updatedAt || 0;
        
        if (serverTime > localTime) {
          // Servidor mais recente: atualizar local
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(serverSettings.data));
          setSettings(serverSettings.data);
          console.log("[SettingsSync] Configurações atualizadas do servidor");
        } else {
          // Local mais recente: já enviamos acima
          console.log("[SettingsSync] Configurações locais enviadas ao servidor");
        }
      }
      
      // 5. Atualizar timestamp de sincronização
      const now = Date.now();
      await AsyncStorage.setItem("settings_last_sync", now.toString());
      setLastSyncTime(new Date(now));
      
      console.log("[SettingsSync] Sincronização completa!");
    } catch (error) {
      console.error("[SettingsSync] Erro na sincronização:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Funções auxiliares para atualizar configurações específicas
  const updateTheme = useCallback(async (theme: "light" | "dark" | "auto") => {
    await saveLocalSettings({ ...settings, themePreference: theme });
  }, [settings, saveLocalSettings]);

  const updateFontSize = useCallback(async (size: "xs" | "sm" | "md" | "lg" | "xl") => {
    await saveLocalSettings({ ...settings, fontSize: size });
  }, [settings, saveLocalSettings]);

  const updateLineSpacing = useCallback(async (spacing: "compact" | "normal" | "expanded") => {
    await saveLocalSettings({ ...settings, lineSpacing: spacing });
  }, [settings, saveLocalSettings]);

  const updateReminders = useCallback(async (enabled: boolean, time?: string, days?: number[]) => {
    await saveLocalSettings({
      ...settings,
      readingRemindersEnabled: enabled,
      ...(time && { readingReminderTime: time }),
      ...(days && { readingReminderDays: days }),
    });
  }, [settings, saveLocalSettings]);

  const updateGoal = useCallback(async (type: "weekly" | "monthly", target: number) => {
    await saveLocalSettings({
      ...settings,
      readingGoalType: type,
      readingGoalTarget: target,
    });
  }, [settings, saveLocalSettings]);

  const updateNightMode = useCallback(async (enabled: boolean) => {
    await saveLocalSettings({ ...settings, nightModeEnabled: enabled });
  }, [settings, saveLocalSettings]);

  return {
    // Estado
    syncEnabled,
    isSyncing,
    lastSyncTime,
    settings,
    
    // Ações
    toggleSync,
    performSync,
    
    // Atualizações específicas
    updateTheme,
    updateFontSize,
    updateLineSpacing,
    updateReminders,
    updateGoal,
    updateNightMode,
    
    // Atualização genérica
    updateSettings: saveLocalSettings,
  };
}
