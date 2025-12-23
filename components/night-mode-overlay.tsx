import { useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNightMode } from "@/hooks/use-night-mode";

export function NightModeOverlay() {
  const { isNightMode } = useNightMode();
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Transição suave de 500ms
    opacity.value = withTiming(isNightMode ? 0.15 : 0, {
      duration: 500,
    });
  }, [isNightMode]);

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
