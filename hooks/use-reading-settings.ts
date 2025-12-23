import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READING_SETTINGS_KEY = "reading_settings";

export type FontSize = "xs" | "s" | "m" | "l" | "xl";
export type LineSpacing = "compact" | "normal" | "expanded";
export interface ReadingSettings {
  fontSize: FontSize;
  lineSpacing: LineSpacing;
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: "m",
  lineSpacing: "normal",
};

export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(READING_SETTINGS_KEY);
      if (data) {
        setSettings(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading reading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: ReadingSettings) => {
    try {
      await AsyncStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving reading settings:", error);
    }
  };

  const setFontSize = async (fontSize: FontSize) => {
    await saveSettings({ ...settings, fontSize });
  };

  const setLineSpacing = async (lineSpacing: LineSpacing) => {
    await saveSettings({ ...settings, lineSpacing });
  };

  const resetToDefaults = async () => {
    await saveSettings(DEFAULT_SETTINGS);
  };

  // Retornar valores de estilo baseados nas configurações
  const getFontSizeValue = (): number => {
    const sizes: Record<FontSize, number> = {
      xs: 14,
      s: 16,
      m: 18,
      l: 20,
      xl: 24,
    };
    return sizes[settings.fontSize];
  };

  const getLineHeightValue = (): number => {
    const baseLineHeight = getFontSizeValue() * 1.5;
    const multipliers: Record<LineSpacing, number> = {
      compact: 0.9,
      normal: 1.0,
      expanded: 1.2,
    };
    return baseLineHeight * multipliers[settings.lineSpacing];
  };

  const getContentStyles = () => {
    const fontSize = getFontSizeValue();
    const lineHeight = getLineHeightValue();

    return {
      fontSize,
      lineHeight,
    };
  };

  return {
    settings,
    loading,
    setFontSize,
    setLineSpacing,
    resetToDefaults,
    getFontSizeValue,
    getLineHeightValue,
    getContentStyles,
  };
}
