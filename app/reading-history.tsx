import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useReadingHistory } from "@/hooks/use-reading-history";
import { ARTICLES, THEMES } from "@/data/mock-data";

export default function ReadingHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history, getTotalReadingTime, getReadArticlesCount } = useReadingHistory();

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  const totalMinutes = getTotalReadingTime();
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const readCount = getReadArticlesCount();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getThemeTitle = (themeId: string) => {
    return THEMES.find((t) => t.id === themeId)?.title || themeId;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Histórico de Leitura",
          headerBackTitle: "Voltar",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={[styles.statsCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="subtitle" style={styles.statsTitle}>
            Estatísticas de Leitura
          </ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: tintColor }]}>
                {readCount}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Artigos Lidos
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: tintColor }]}>
                {totalHours > 0 ? `${totalHours}h ${remainingMinutes}min` : `${remainingMinutes}min`}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Tempo Total
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {history.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="clock.fill" size={48} color={textSecondary} />
            <ThemedText style={styles.emptyText}>Nenhum histórico ainda</ThemedText>
            <ThemedText style={[styles.emptyHint, { color: textSecondary }]}>
              Comece a ler artigos para ver seu histórico aqui
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.historyList}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Histórico Recente
            </ThemedText>
            {history.map((item, index) => {
              const article = ARTICLES.find((a) => a.id === item.articleId);
              if (!article) return null;

              return (
                <Pressable
                  key={`${item.articleId}-${index}`}
                  onPress={() => router.push(`/article/${item.articleId}` as any)}
                  style={({ pressed }) => [
                    styles.historyItem,
                    { backgroundColor: cardBg, borderColor },
                    pressed && styles.historyItemPressed,
                  ]}
                >
                  <ThemedView style={styles.historyContent}>
                    <ThemedView style={styles.historyHeader}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.historyTitle}
                        numberOfLines={2}
                      >
                        {item.articleTitle}
                      </ThemedText>
                      {item.progress === 100 && (
                        <ThemedView style={[styles.completeBadge, { backgroundColor: tintColor }]}>
                          <ThemedText style={styles.completeBadgeText}>✓</ThemedText>
                        </ThemedView>
                      )}
                    </ThemedView>
                    <ThemedText style={[styles.historyTheme, { color: textSecondary }]}>
                      {getThemeTitle(item.themeId)}
                    </ThemedText>
                    <ThemedView style={styles.historyMeta}>
                      <ThemedText style={[styles.historyDate, { color: textSecondary }]}>
                        {formatDate(item.readAt)}
                      </ThemedText>
                      <ThemedText style={[styles.historyTime, { color: textSecondary }]}>
                        {item.readingTime} min de leitura
                      </ThemedText>
                    </ThemedView>
                    {item.progress < 100 && (
                      <ThemedView style={styles.progressContainer}>
                        <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
                          <ThemedView
                            style={[
                              styles.progressFill,
                              { backgroundColor: tintColor, width: `${item.progress}%` },
                            ]}
                          />
                        </ThemedView>
                        <ThemedText style={[styles.progressText, { color: textSecondary }]}>
                          {item.progress}%
                        </ThemedText>
                      </ThemedView>
                    )}
                  </ThemedView>
                  <IconSymbol name="chevron.right" size={20} color={textSecondary} />
                </Pressable>
              );
            })}
          </ThemedView>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  historyList: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  historyItemPressed: {
    opacity: 0.7,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4,
  },
  historyTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  completeBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  completeBadgeText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  historyTheme: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: "row",
    gap: 12,
  },
  historyDate: {
    fontSize: 12,
    lineHeight: 18,
  },
  historyTime: {
    fontSize: 12,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    lineHeight: 18,
    minWidth: 35,
    textAlign: "right",
  },
});
