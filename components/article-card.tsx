import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Article } from "@/types";
import { THEMES } from "@/data/mock-data";
import { calculateReadingTime, formatReadingTime } from "@/utils/reading-time";

interface ArticleCardProps {
  article: Article;
  isFavorite?: boolean;
  onPress: () => void;
  badge?: string;
}

export function ArticleCard({ article, isFavorite, onPress, badge }: ArticleCardProps) {
  const cardBg = useThemeColor({}, "cardBackground");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");

  const theme = THEMES.find((t) => t.id === article.themeId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

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
          <ThemedText type="defaultSemiBold" style={styles.theme}>
            {theme?.title || "Tema"}
          </ThemedText>
          <ThemedView style={styles.headerIcons}>
            {badge && (
              <ThemedView style={[styles.badge, { backgroundColor: tintColor }]}>
                <ThemedText style={styles.badgeText}>{badge}</ThemedText>
              </ThemedView>
            )}
            {isFavorite && (
              <IconSymbol name="heart.fill" size={18} color={tintColor} />
            )}
          </ThemedView>
        </ThemedView>

        <ThemedText type="subtitle" style={styles.title} numberOfLines={2}>
          {article.title}
        </ThemedText>

        <ThemedText style={[styles.summary, { color: secondaryText }]} numberOfLines={3}>
          {article.summary}
        </ThemedText>

        <ThemedView style={styles.footer}>
          <ThemedText style={[styles.date, { color: secondaryText }]}>
            {formatDate(article.date)}
          </ThemedText>
          <ThemedView style={styles.readingTime}>
            <IconSymbol name="clock.fill" size={14} color={secondaryText} />
            <ThemedText style={[styles.readingTimeText, { color: secondaryText }]}>
              {formatReadingTime(calculateReadingTime(article.content))}
            </ThemedText>
          </ThemedView>
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
    marginBottom: 8,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
  },
  theme: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 8,
    lineHeight: 26,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
  },
  readingTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readingTimeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
});
