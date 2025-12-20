import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FONT_SIZE_KEY = "siga_o_dinheiro_font_size";

export type FontSizeOption = "small" | "medium" | "large" | "extra-large";

const FONT_SIZES = {
  small: {
    body: 14,
    title: 28,
    subtitle: 18,
  },
  medium: {
    body: 16,
    title: 32,
    subtitle: 20,
  },
  large: {
    body: 18,
    title: 36,
    subtitle: 22,
  },
  "extra-large": {
    body: 20,
    title: 40,
    subtitle: 24,
  },
};

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSizeOption>("medium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const saved = await AsyncStorage.getItem(FONT_SIZE_KEY);
      if (saved) {
        setFontSize(saved as FontSizeOption);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar tamanho de fonte:", error);
      setLoading(false);
    }
  };

  const updateFontSize = async (size: FontSizeOption) => {
    try {
      await AsyncStorage.setItem(FONT_SIZE_KEY, size);
      setFontSize(size);
    } catch (error) {
      console.error("Erro ao salvar tamanho de fonte:", error);
    }
  };

  const getFontSizes = () => FONT_SIZES[fontSize];

  return {
    fontSize,
    updateFontSize,
    getFontSizes,
    loading,
  };
}
