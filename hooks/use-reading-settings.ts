import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READING_SETTINGS_KEY = "reading_settings";

export type FontSize = "xs" | "s" | "m" | "l" | "xl";
export type LineSpacing = "compact" | "normal" | "expanded";
export type ReadingMode = "default" | "sepia" | "high-contrast";

export interface ReadingSettings {
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  mode: ReadingMode;
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: "m",
  lineSpacing: "normal",
  mode: "default",
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

  const setMode = async (mode: ReadingMode) => {
    await saveSettings({ ...settings, mode });
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

  const getModeColors = (): {
    background: string;
    text: string;
    cardBg: string;
    border: string;
  } => {
    switch (settings.mode) {
      case "sepia":
        return {
          background: "#F4ECD8",
          text: "#5B4636",
          cardBg: "#EDE3D0",
          border: "#D4C4A8",
        };
      case "high-contrast":
        return {
          background: "#000000",
          text: "#FFFFFF",
          cardBg: "#1A1A1A",
          border: "#333333",
        };
      default:
        return {
          background: "",
          text: "",
          cardBg: "",
          border: "",
        };
    }
  };

  const getContentStyles = () => {
    const fontSize = getFontSizeValue();
    const lineHeight = getLineHeightValue();
    const colors = getModeColors();

    return {
      fontSize,
      lineHeight,
      ...(colors.text && { color: colors.text }),
    };
  };

  const getContainerStyles = () => {
    const colors = getModeColors();

    return {
      ...(colors.background && { backgroundColor: colors.background }),
    };
  };

  return {
    settings,
    loading,
    setFontSize,
    setLineSpacing,
    setMode,
    resetToDefaults,
    getFontSizeValue,
    getLineHeightValue,
    getModeColors,
    getContentStyles,
    getContainerStyles,
  };
}
