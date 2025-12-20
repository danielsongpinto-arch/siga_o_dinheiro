import { useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_PREFERENCE_KEY = "@siga_o_dinheiro:theme_preference";

export type ThemePreference = "light" | "dark" | "auto";

export function useThemePreference() {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (stored) {
        setPreference(stored as ThemePreference);
      }
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
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Determinar o tema efetivo baseado na preferência
  const effectiveTheme = preference === "auto" ? systemColorScheme : preference;

  return {
    preference,
    effectiveTheme,
    updatePreference,
    loading,
  };
}
