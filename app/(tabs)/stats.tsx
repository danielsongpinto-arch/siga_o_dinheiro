import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllBookmarks, type Bookmark, PREDEFINED_TAGS } from "@/components/article-bookmarks";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
    cardBg: useThemeColor({ light: "#F9F9F9", dark: "#1C1C1E" }, "background"),
  };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const allBookmarks = await getAllBookmarks();
      setBookmarks(allBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const totalBookmarks = bookmarks.length;

  // Destaques por artigo
  const bookmarksByArticle: Record<string, number> = {};
  bookmarks.forEach((bookmark) => {
    bookmarksByArticle[bookmark.articleTitle] =
      (bookmarksByArticle[bookmark.articleTitle] || 0) + 1;
  });
  const topArticles = Object.entries(bookmarksByArticle)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Tags mais usadas
  const tagCounts: Record<string, number> = {};
  bookmarks.forEach((bookmark) => {
    bookmark.tags?.forEach((tagId) => {
      tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tagId, count]) => {
      const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
      return { tag, count };
    });

  // Destaques por mês (últimos 6 meses)
  const now = new Date();
  const monthlyData: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    monthlyData[key] = 0;
  }

  bookmarks.forEach((bookmark) => {
    const date = new Date(bookmark.createdAt);
    const key = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    if (monthlyData[key] !== undefined) {
      monthlyData[key]++;
    }
  });

  const monthlyChartData = Object.entries(monthlyData);
  const maxMonthlyCount = Math.max(...Object.values(monthlyData), 1);

  // Destaques com notas
  const bookmarksWithNotes = bookmarks.filter((b) => b.note && b.note.trim().length > 0).length;
  const notesPercentage = totalBookmarks > 0 ? (bookmarksWithNotes / totalBookmarks) * 100 : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 40,
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Estatísticas
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Seu progresso de leitura
          </ThemedText>
        </View>

        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        ) : totalBookmarks === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="chart.bar.fill" size={64} color={colors.icon} />
            <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
              Nenhum destaque ainda
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              Comece a ler e salvar destaques para ver suas estatísticas
            </ThemedText>
          </ThemedView>
        ) : (
          <>
            {/* Cards de Resumo */}
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, { backgroundColor: colors.cardBg }]}>
                <IconSymbol name="bookmark.fill" size={32} color={colors.tint} />
                <ThemedText type="title" style={styles.summaryNumber}>
                  {totalBookmarks}
                </ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Destaques
                </ThemedText>
              </View>

              <View style={[styles.summaryCard, { backgroundColor: colors.cardBg }]}>
                <IconSymbol name="book.fill" size={32} color="#FF9500" />
                <ThemedText type="title" style={styles.summaryNumber}>
                  {Object.keys(bookmarksByArticle).length}
                </ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Artigos
                </ThemedText>
              </View>

              <View style={[styles.summaryCard, { backgroundColor: colors.cardBg }]}>
                <IconSymbol name="pencil" size={32} color="#34C759" />
                <ThemedText type="title" style={styles.summaryNumber}>
                  {notesPercentage.toFixed(0)}%
                </ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Com Notas
                </ThemedText>
              </View>
            </View>

            {/* Artigos Mais Destacados */}
            {topArticles.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Artigos Mais Destacados
                </ThemedText>
                <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                  {topArticles.map(([title, count], index) => (
                    <View
                      key={title}
                      style={[
                        styles.listItem,
                        { borderBottomColor: colors.border },
                        index === topArticles.length - 1 && styles.listItemLast,
                      ]}
                    >
                      <View style={styles.listItemLeft}>
                        <View
                          style={[
                            styles.rankBadge,
                            {
                              backgroundColor:
                                index === 0
                                  ? "#FFD700"
                                  : index === 1
                                    ? "#C0C0C0"
                                    : index === 2
                                      ? "#CD7F32"
                                      : colors.border,
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.rankText,
                              { color: index < 3 ? "#000" : colors.text },
                            ]}
                          >
                            {index + 1}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.listItemTitle} numberOfLines={2}>
                          {title}
                        </ThemedText>
                      </View>
                      <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
                        {count}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Tags Mais Usadas */}
            {topTags.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Tags Mais Usadas
                </ThemedText>
                <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                  {topTags.map(({ tag, count }, index) => {
                    if (!tag) return null;
                    return (
                      <View
                        key={tag.id}
                        style={[
                          styles.tagItem,
                          { borderBottomColor: colors.border },
                          index === topTags.length - 1 && styles.listItemLast,
                        ]}
                      >
                        <View style={styles.tagItemLeft}>
                          <View
                            style={[styles.tagDot, { backgroundColor: tag.color }]}
                          />
                          <ThemedText style={styles.tagLabel}>{tag.label}</ThemedText>
                        </View>
                        <View style={styles.tagItemRight}>
                          <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
                            {count}
                          </ThemedText>
                          <View style={styles.progressBarContainer}>
                            <View
                              style={[
                                styles.progressBar,
                                {
                                  backgroundColor: tag.color,
                                  width: `${(count / totalBookmarks) * 100}%`,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Atividade Mensal */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Atividade Mensal
              </ThemedText>
              <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                <View style={styles.chartContainer}>
                  {monthlyChartData.map(([month, count]) => {
                    const heightPercentage = (count / maxMonthlyCount) * 100;
                    return (
                      <View key={month} style={styles.chartBar}>
                        <View style={styles.chartBarContainer}>
                          <View
                            style={[
                              styles.chartBarFill,
                              {
                                backgroundColor: colors.tint,
                                height: `${Math.max(heightPercentage, 5)}%`,
                              },
                            ]}
                          />
                        </View>
                        <ThemedText style={[styles.chartLabel, { color: colors.icon }]}>
                          {month.split(" ")[0]}
                        </ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={[styles.chartValue, { color: colors.text }]}
                        >
                          {count}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  summaryNumber: {
    fontSize: 28,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
  },
  listItemTitle: {
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  tagItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagLabel: {
    fontSize: 15,
  },
  tagItemRight: {
    alignItems: "flex-end",
    gap: 6,
    minWidth: 60,
  },
  progressBarContainer: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
    height: 200,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  chartValue: {
    fontSize: 13,
    textAlign: "center",
  },
});
