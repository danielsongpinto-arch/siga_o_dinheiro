import { StyleSheet, ScrollView, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllBookmarks, type Bookmark } from "@/components/article-bookmarks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookmarksScreen() {
  const router = useRouter();
  const colors = {
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({}, "border"),
    cardBg: useThemeColor({}, "cardBackground"),
  };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"article" | "date">("article");

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

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const stored = await AsyncStorage.getItem("article_bookmarks");
      if (stored) {
        const allBookmarks: Bookmark[] = JSON.parse(stored);
        const updated = allBookmarks.filter((b) => b.id !== bookmarkId);
        await AsyncStorage.setItem("article_bookmarks", JSON.stringify(updated));
        setBookmarks(updated);
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const navigateToArticle = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/article/${articleId}` as any);
  };

  const groupedBookmarks = () => {
    if (groupBy === "article") {
      const grouped: Record<string, Bookmark[]> = {};
      bookmarks.forEach((bookmark) => {
        if (!grouped[bookmark.articleId]) {
          grouped[bookmark.articleId] = [];
        }
        grouped[bookmark.articleId].push(bookmark);
      });
      return grouped;
    }
    return { all: bookmarks };
  };

  const grouped = groupedBookmarks();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Meus Destaques
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
          {bookmarks.length} {bookmarks.length === 1 ? "destaque salvo" : "destaques salvos"}
        </ThemedText>
      </ThemedView>

      <View style={[styles.filterContainer, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => {
            setGroupBy("article");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.filterButton,
            groupBy === "article" && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.filterButtonText,
              groupBy === "article" && { color: "#fff" },
            ]}
          >
            Por Artigo
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => {
            setGroupBy("date");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.filterButton,
            groupBy === "date" && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.filterButtonText,
              groupBy === "date" && { color: "#fff" },
            ]}
          >
            Por Data
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        ) : bookmarks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="bookmark" size={64} color={colors.icon} />
            <ThemedText style={styles.emptyText}>Nenhum destaque ainda</ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              Comece a marcar trechos importantes dos artigos
            </ThemedText>
          </ThemedView>
        ) : (
          Object.entries(grouped).map(([key, items]) => (
            <ThemedView key={key} style={styles.section}>
              {groupBy === "article" && (
                <Pressable
                  onPress={() => navigateToArticle(items[0].articleId)}
                  style={styles.sectionHeader}
                >
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    {items[0].articleTitle}
                  </ThemedText>
                  <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </Pressable>
              )}

              {items.map((bookmark) => (
                <ThemedView
                  key={bookmark.id}
                  style={[styles.bookmarkCard, { borderColor: colors.border }]}
                >
                  <Pressable
                    onPress={() => navigateToArticle(bookmark.articleId)}
                    style={styles.bookmarkContent}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.partTitle}>
                      {bookmark.partTitle}
                    </ThemedText>

                    <ThemedText style={[styles.excerpt, { color: colors.icon }]}>
                      "{bookmark.excerpt}"
                    </ThemedText>

                    {bookmark.note && (
                      <ThemedText style={styles.note}>💭 {bookmark.note}</ThemedText>
                    )}

                    {groupBy === "date" && (
                      <ThemedText style={[styles.articleTitle, { color: colors.icon }]}>
                        📄 {bookmark.articleTitle}
                      </ThemedText>
                    )}

                    <ThemedText style={[styles.timestamp, { color: colors.icon }]}>
                      {new Date(bookmark.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => deleteBookmark(bookmark.id)}
                    style={styles.deleteButton}
                  >
                    <IconSymbol name="trash" size={20} color="#FF3B30" />
                  </Pressable>
                </ThemedView>
              ))}
            </ThemedView>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
  },
  bookmarkCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  bookmarkContent: {
    flex: 1,
  },
  partTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  articleTitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});
