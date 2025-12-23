import { useRef, useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTabBar } from "@/contexts/tab-bar-context";

export function useScrollHideTabBar() {
  const { setTabBarVisible } = useTabBar();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("up");

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const delta = currentScrollY - lastScrollY.current;

      // Ignorar movimentos muito pequenos (< 5px)
      if (Math.abs(delta) < 5) {
        return;
      }

      // Detectar direção do scroll
      if (delta > 0 && scrollDirection.current !== "down") {
        // Rolando para baixo - ocultar tab bar
        scrollDirection.current = "down";
        setTabBarVisible(false);
      } else if (delta < 0 && scrollDirection.current !== "up") {
        // Rolando para cima - mostrar tab bar
        scrollDirection.current = "up";
        setTabBarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    },
    [setTabBarVisible],
  );

  // Resetar ao desmontar
  const resetTabBar = useCallback(() => {
    setTabBarVisible(true);
    lastScrollY.current = 0;
    scrollDirection.current = "up";
  }, [setTabBarVisible]);

  return {
    handleScroll,
    resetTabBar,
  };
}
