import { useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_PREFERENCE_KEY = "@siga_o_dinheiro:theme_preference";
const AUTO_THEME_ENABLED_KEY = "@siga_o_dinheiro:auto_theme_enabled";

export type ThemePreference = "light" | "dark" | "auto";

export function useThemePreference() {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [loading, setLoading] = useState(true);
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(false);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (stored) {
        setPreference(stored as ThemePreference);
      }
      
      // Verificar se Tema Automático (Nascer/Pôr do Sol) está ativo
      const autoEnabled = await AsyncStorage.getItem(AUTO_THEME_ENABLED_KEY);
      setAutoThemeEnabled(autoEnabled === "true");
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (newPreference: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newPreference);
      setPreference(newPreference);
      
      // Se o usuário escolher manualmente "light" ou "dark", desativar Tema Automático
      if (newPreference !== "auto" && autoThemeEnabled) {
        await AsyncStorage.setItem(AUTO_THEME_ENABLED_KEY, "false");
        setAutoThemeEnabled(false);
        console.log("[useThemePreference] Desativando Tema Automático porque usuário escolheu manualmente:", newPreference);
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Determinar o tema efetivo baseado na preferência
  // Se o usuário escolheu "light" ou "dark" manualmente, sempre usar essa escolha
  let effectiveTheme: "light" | "dark";
  
  if (preference === "light") {
    effectiveTheme = "light";
  } else if (preference === "dark") {
    effectiveTheme = "dark";
  } else {
    // preference === "auto" - seguir sistema
    effectiveTheme = systemColorScheme || "light";
  }
  
  // Debug logs
  useEffect(() => {
    console.log("[useThemePreference] preference:", preference);
    console.log("[useThemePreference] systemColorScheme:", systemColorScheme);
    console.log("[useThemePreference] autoThemeEnabled:", autoThemeEnabled);
    console.log("[useThemePreference] effectiveTheme:", effectiveTheme);
  }, [preference, systemColorScheme, autoThemeEnabled, effectiveTheme]);

  return {
    preference,
    effectiveTheme,
    updatePreference,
    loading,
  };
}
