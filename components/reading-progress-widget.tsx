import { View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ReadingProgressWidgetProps {
  progress: number; // 0-100
  estimatedTimeMinutes: number;
  currentPosition: string; // e.g., "Parte 3 de 7"
}

export function ReadingProgressWidget({
  progress,
  estimatedTimeMinutes,
  currentPosition,
}: ReadingProgressWidgetProps) {
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "icon");
  const cardBg = useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background");
  const borderColor = useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text");

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return "< 1 min";
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: cardBg, borderColor }]}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBg, { backgroundColor: borderColor }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: tintColor },
            ]}
          />
        </View>
      </View>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
            Progresso
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.infoValue}>
            {Math.round(progress)}%
          </ThemedText>
        </View>

        <View style={styles.infoItem}>
          <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
            Tempo restante
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.infoValue}>
            {formatTime(estimatedTimeMinutes)}
          </ThemedText>
        </View>

        <View style={styles.infoItem}>
          <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
            Posição
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.infoValue}>
            {currentPosition}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
});
