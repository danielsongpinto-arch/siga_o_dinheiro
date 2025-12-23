import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NIGHT_MODE_KEY = "night_mode_settings";
const NIGHT_START_HOUR = 20; // 20h
const NIGHT_END_HOUR = 7; // 7h

interface NightModeSettings {
  enabled: boolean; // Se o modo noturno automático está ativado
  manualOverride: boolean; // Se o usuário forçou on/off manualmente
  manualState: boolean; // Estado manual (true = forçar on, false = forçar off)
}

export function useNightMode() {
  const [settings, setSettings] = useState<NightModeSettings>({
    enabled: true, // Ativado por padrão
    manualOverride: false,
    manualState: false,
  });
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Atualizar estado do modo noturno a cada minuto
    const interval = setInterval(() => {
      updateNightMode();
    }, 60000); // 1 minuto

    // Atualizar imediatamente
    updateNightMode();

    return () => clearInterval(interval);
  }, [settings]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NIGHT_MODE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading night mode settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NightModeSettings) => {
    try {
      await AsyncStorage.setItem(NIGHT_MODE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving night mode settings:", error);
    }
  };

  const isNightTime = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    
    // Entre 20h e 7h é considerado noite
    return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
  };

  const updateNightMode = () => {
    if (settings.manualOverride) {
      // Se há override manual, usar estado manual
      setIsNightMode(settings.manualState);
    } else if (settings.enabled) {
      // Se modo automático está ativado, verificar horário
      setIsNightMode(isNightTime());
    } else {
      // Se modo automático está desativado, sempre off
      setIsNightMode(false);
    }
  };

  const toggleAutoMode = async () => {
    const newSettings: NightModeSettings = {
      ...settings,
      enabled: !settings.enabled,
      manualOverride: false, // Remover override ao mudar modo automático
    };
    await saveSettings(newSettings);
  };

  const setManualMode = async (state: boolean) => {
    const newSettings: NightModeSettings = {
      ...settings,
      manualOverride: true,
      manualState: state,
    };
    await saveSettings(newSettings);
  };

  const clearManualOverride = async () => {
    const newSettings: NightModeSettings = {
      ...settings,
      manualOverride: false,
    };
    await saveSettings(newSettings);
  };

  return {
    isNightMode,
    loading,
    autoModeEnabled: settings.enabled,
    hasManualOverride: settings.manualOverride,
    toggleAutoMode,
    setManualMode,
    clearManualOverride,
  };
}
