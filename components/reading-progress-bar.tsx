import { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { ThemedText } from "./themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ReadingProgressBarProps {
  scrollY: Animated.Value;
  contentHeight: number;
  containerHeight: number;
}

export function ReadingProgressBar({ scrollY, contentHeight, containerHeight }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const scrollableHeight = contentHeight - containerHeight;
      if (scrollableHeight > 0) {
        const progressValue = Math.min(Math.max((value / scrollableHeight) * 100, 0), 100);
        setProgress(Math.round(progressValue));
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, contentHeight, containerHeight]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: tintColor }]} />
      </View>
      <ThemedText style={styles.progressText}>{progress}% lido</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginRight: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
});
