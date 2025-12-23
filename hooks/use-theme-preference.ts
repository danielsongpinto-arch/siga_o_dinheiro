import { useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettingsSync } from "./use-settings-sync";

const THEME_PREFERENCE_KEY = "@siga_o_dinheiro:theme_preference";
// const AUTO_THEME_ENABLED_KEY = "@siga_o_dinheiro:auto_theme_enabled"; // REMOVIDO

export type ThemePreference = "light" | "dark" | "auto";

export function useThemePreference() {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [loading, setLoading] = useState(true);
  const { syncEnabled, settings, updateTheme } = useSettingsSync();
  // const [autoThemeEnabled, setAutoThemeEnabled] = useState(false); // REMOVIDO

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      // Se sync ativado, carregar do servidor
      if (syncEnabled && settings.themePreference) {
        setPreference(settings.themePreference);
        console.log("[useThemePreference] Carregado do servidor:", settings.themePreference);
      } else {
        // Caso contrário, carregar do AsyncStorage local
        const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (stored) {
          setPreference(stored as ThemePreference);
        }
      }
      
      // Tema Automático (Nascer/Pôr do Sol) REMOVIDO
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (newPreference: ThemePreference) => {
    console.log("[useThemePreference] updatePreference CHAMADO com:", newPreference);
    console.log("[useThemePreference] Estado atual - preference:", preference);
    
    try {
      // Forçar atualização de estado ANTES de salvar (para feedback imediato)
      setPreference(newPreference);
      console.log("[useThemePreference] Estado atualizado para:", newPreference);
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newPreference);
      console.log("[useThemePreference] Salvo no AsyncStorage:", newPreference);
      
      // Se sync ativado, sincronizar com servidor
      if (syncEnabled) {
        await updateTheme(newPreference);
        console.log("[useThemePreference] Sincronizado com servidor:", newPreference);
      }
      
      // Tema Automático (Nascer/Pôr do Sol) REMOVIDO
      
      console.log("[useThemePreference] updatePreference CONCLUÍDO com sucesso!");
    } catch (error) {
      console.error("[useThemePreference] ERRO ao salvar preferência:", error);
      // Mesmo com erro, manter o estado atualizado para feedback visual
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
    // console.log("[useThemePreference] autoThemeEnabled:", autoThemeEnabled); // REMOVIDO
    console.log("[useThemePreference] effectiveTheme:", effectiveTheme);
  }, [preference, systemColorScheme, effectiveTheme]);

  return {
    preference,
    effectiveTheme,
    updatePreference,
    loading,
  };
}
