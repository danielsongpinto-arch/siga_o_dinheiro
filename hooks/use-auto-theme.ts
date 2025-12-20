import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const AUTO_THEME_KEY = "@siga_o_dinheiro:auto_theme";
const AUTO_THEME_ENABLED_KEY = "@siga_o_dinheiro:auto_theme_enabled";

interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

export function useAutoTheme() {
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(false);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (autoThemeEnabled) {
      updateSunTimes();
      // Atualizar a cada hora
      const interval = setInterval(updateSunTimes, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoThemeEnabled]);

  const loadSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(AUTO_THEME_ENABLED_KEY);
      const stored = await AsyncStorage.getItem(AUTO_THEME_KEY);
      
      if (enabled === "true") {
        setAutoThemeEnabled(true);
        if (stored) {
          const times = JSON.parse(stored);
          setSunTimes({
            sunrise: new Date(times.sunrise),
            sunset: new Date(times.sunset),
          });
        }
      }
    } catch (error) {
      console.error("Error loading auto theme settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSunTimes = async () => {
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      const { latitude, longitude } = location.coords;

      // Calcular horários do nascer e pôr do sol
      const times = calculateSunTimes(latitude, longitude, new Date());
      
      setSunTimes(times);
      await AsyncStorage.setItem(AUTO_THEME_KEY, JSON.stringify({
        sunrise: times.sunrise.toISOString(),
        sunset: times.sunset.toISOString(),
      }));
    } catch (error) {
      console.error("Error updating sun times:", error);
    }
  };

  const toggleAutoTheme = async (enabled: boolean) => {
    try {
      setAutoThemeEnabled(enabled);
      await AsyncStorage.setItem(AUTO_THEME_ENABLED_KEY, enabled.toString());
      
      if (enabled) {
        await updateSunTimes();
      }
    } catch (error) {
      console.error("Error toggling auto theme:", error);
    }
  };

  const shouldUseDarkMode = (): boolean => {
    if (!autoThemeEnabled || !sunTimes) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const sunriseTime = sunTimes.sunrise.getHours() * 60 + sunTimes.sunrise.getMinutes();
    const sunsetTime = sunTimes.sunset.getHours() * 60 + sunTimes.sunset.getMinutes();

    // Modo escuro entre pôr do sol e nascer do sol
    return currentTime >= sunsetTime || currentTime < sunriseTime;
  };

  return {
    autoThemeEnabled,
    sunTimes,
    loading,
    toggleAutoTheme,
    shouldUseDarkMode,
  };
}

// Algoritmo simplificado para calcular horários do nascer e pôr do sol
// Baseado em: https://en.wikipedia.org/wiki/Sunrise_equation
function calculateSunTimes(latitude: number, longitude: number, date: Date): SunTimes {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Dia do ano
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Ângulo do dia
  const gamma =
    (2 * Math.PI / 365) * (dayOfYear - 1 + (date.getHours() - 12) / 24);

  // Equação do tempo (em minutos)
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Declinação solar (em radianos)
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Ângulo horário do nascer/pôr do sol
  const ha =
    Math.acos(
      Math.cos(90.833 * rad) / (Math.cos(latitude * rad) * Math.cos(decl)) -
        Math.tan(latitude * rad) * Math.tan(decl)
    ) * deg;

  // Tempo solar verdadeiro do nascer e pôr do sol (em minutos)
  const sunriseTime = 720 - 4 * (longitude + ha) - eqtime;
  const sunsetTime = 720 - 4 * (longitude - ha) - eqtime;

  // Converter para horas locais
  const sunrise = new Date(date);
  sunrise.setHours(0, Math.round(sunriseTime), 0, 0);

  const sunset = new Date(date);
  sunset.setHours(0, Math.round(sunsetTime), 0, 0);

  return { sunrise, sunset };
}
