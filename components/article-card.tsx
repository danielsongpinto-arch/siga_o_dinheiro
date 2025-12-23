import { Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useOfflineArticles } from "@/hooks/use-offline-articles";
import { useOfflineCache } from "@/hooks/use-offline-cache";
import { useBatchDownload } from "@/hooks/use-batch-download";
import * as Haptics from "expo-haptics";
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
  const { getProgress } = useReadingProgress();
  const { isArticleOffline } = useOfflineArticles();
  const { isArticleCached, cacheArticle, removeFromCache, downloadProgress } = useOfflineCache();
  const { batchStatus, downloadSeries, getSeriesArticleCount } = useBatchDownload();
  const [isCaching, setIsCaching] = useState(false);
  
  const progress = getProgress(article.id);
  const isOffline = isArticleOffline(article.id);

  const theme = THEMES.find((t) => t.id === article.themeId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDownloadToggle = async (e: any) => {
    e.stopPropagation(); // Prevenir navegação ao clicar no botão
    
    if (isCaching) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCaching(true);

    try {
      if (isArticleCached(article.id)) {
        await removeFromCache(article.id);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await cacheArticle({
          id: article.id,
          title: article.title,
          content: article.content,
          author: article.authors?.map(a => a.name).join(", ") || "Autor",
          date: article.date,
          series: article.themeId,
          tags: [],
          cachedAt: new Date().toISOString(),
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error toggling cache:", error);
    } finally {
      setIsCaching(false);
    }
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
            {isOffline && (
              <IconSymbol name="arrow.down.circle.fill" size={18} color="#34C759" />
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

        {/* Barra de Progresso */}
        {progress && progress.progress > 0 && (
          <ThemedView style={styles.progressContainer}>
            <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
              <ThemedView
                style={[
                  styles.progressFill,
                  { backgroundColor: tintColor, width: `${progress.progress}%` },
                ]}
              />
            </ThemedView>
            <ThemedText style={[styles.progressText, { color: secondaryText }]}>
              {progress.completed ? "✓ Completo" : `${progress.progress}% lido`}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.footer}>
          <ThemedView style={styles.footerLeft}>
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
          
          {/* Botões de Download */}
          <ThemedView style={styles.downloadButtons}>
            {/* Botão de Download em Lote (Série) */}
            {article.themeId && getSeriesArticleCount(article.themeId) > 1 && (
              <Pressable
                onPress={async (e) => {
                  e.stopPropagation();
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await downloadSeries(article.themeId);
                }}
                disabled={batchStatus[article.themeId]?.isDownloading}
                style={({ pressed }) => [
                  styles.downloadButton,
                  pressed && styles.pressed,
                ]}
              >
                {batchStatus[article.themeId]?.isDownloading ? (
                  <ThemedText style={styles.batchText}>
                    {batchStatus[article.themeId].current}/{batchStatus[article.themeId].total}
                  </ThemedText>
                ) : (
                  <IconSymbol
                    name="arrow.down.to.line"
                    size={24}
                    color={tintColor}
                  />
                )}
              </Pressable>
            )}
            
            {/* Botão de Download Individual */}
            <Pressable
              onPress={handleDownloadToggle}
              disabled={isCaching}
              style={({ pressed }) => [
                styles.downloadButton,
                pressed && styles.pressed,
              ]}
            >
              <IconSymbol
                name={isArticleCached(article.id) ? "arrow.down.circle.fill" : "arrow.down.circle"}
                size={24}
                color={isArticleCached(article.id) ? "#34C759" : secondaryText}
              />
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* Barra de Progresso de Download */}
        {downloadProgress[article.id] && (
          <ThemedView style={styles.progressContainer}>
            <ThemedView
              style={[
                styles.progressBar,
                {
                  width: `${downloadProgress[article.id].progress}%`,
                  backgroundColor:
                    downloadProgress[article.id].status === "error"
                      ? "#FF3B30"
                      : downloadProgress[article.id].status === "completed"
                      ? "#34C759"
                      : "#007AFF",
                },
              ]}
            />
          </ThemedView>
        )}
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
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  downloadButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadButton: {
    padding: 4,
  },
  batchText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 1.5,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 1.5,
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
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
});
