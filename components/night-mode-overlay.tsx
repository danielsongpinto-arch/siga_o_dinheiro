import { useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNightMode } from "@/hooks/use-night-mode";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function NightModeOverlay() {
  const { isNightMode } = useNightMode();
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Se o tema for escuro, reduzir a opacidade do filtro para não clarear demais
    const targetOpacity = colorScheme === "dark" ? 0.08 : 0.15;
    opacity.value = withTiming(isNightMode ? targetOpacity : 0, {
      duration: 500,
    });
  }, [isNightMode, colorScheme]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Não renderizar se não estiver ativo
  if (!isNightMode) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.overlay, animatedStyle]}
      pointerEvents="none" // Não bloquear interações
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FF8C00", // Laranja/âmbar para filtro de luz azul
    zIndex: 9999,
  },
});
