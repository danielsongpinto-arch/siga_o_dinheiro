import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Series } from "@/types/series";

interface SeriesCardProps {
  series: Series;
  progress: number;
  isCompleted: boolean;
  onPress: () => void;
}

export function SeriesCard({ series, progress, isCompleted, onPress }: SeriesCardProps) {
  const cardBg = useThemeColor({}, "cardBackground");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: cardBg, borderColor },
        pressed && styles.pressed,
      ]}
    >
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerLeft}>
            <IconSymbol name="book.fill" size={20} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.partsText}>
              {series.totalParts} {series.totalParts === 1 ? "parte" : "partes"}
            </ThemedText>
          </ThemedView>
          {isCompleted && (
            <ThemedView style={[styles.completedBadge, { backgroundColor: tintColor }]}>
              <IconSymbol name="checkmark.circle.fill" size={16} color="#fff" />
              <ThemedText style={styles.completedText}>Concluída</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedText type="subtitle" style={styles.title} numberOfLines={2}>
          {series.title}
        </ThemedText>

        <ThemedText style={[styles.description, { color: secondaryText }]} numberOfLines={3}>
          {series.description}
        </ThemedText>

        <ThemedView style={styles.progressContainer}>
          <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
            <ThemedView
              style={[
                styles.progressFill,
                { backgroundColor: tintColor, width: `${progress}%` },
              ]}
            />
          </ThemedView>
          <ThemedText style={[styles.progressText, { color: secondaryText }]}>
            {progress}% completo
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  partsText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    color: "#fff",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
  },
  title: {
    marginBottom: 8,
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
});
