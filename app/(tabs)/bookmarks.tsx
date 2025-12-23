import { View, ScrollView, Pressable, StyleSheet, Alert, Text, TextInput, Share } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllBookmarks, type Bookmark, PREDEFINED_TAGS } from "@/components/article-bookmarks";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ArticleComment {
  id: string;
  articleId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}
import { exportBookmarksToPDF } from "@/lib/export-pdf";
import { QuoteImageGenerator } from "@/components/quote-image-generator";
import { useReviewTracking } from "@/hooks/use-review-tracking";

export default function BookmarksScreen() {
  const router = useRouter();
  const colors = {
    text: useThemeColor({}, "text"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
    cardBg: useThemeColor({ light: "#F9F9F9", dark: "#1C1C1E" }, "background"),
  };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"article" | "date">("article");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "old">("all");
  const { trackBookmarkView } = useReviewTracking();

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

  const navigateToArticle = async (articleId: string, bookmarkCreatedAt?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Rastrear visualização de destaque antigo
    if (bookmarkCreatedAt) {
      const wasTracked = await trackBookmarkView(bookmarkCreatedAt);
      if (wasTracked) {
        console.log("[ReviewTracking] Visualização de destaque antigo registrada");
      }
    }
    
    router.push(`/article/${articleId}` as any);
  };

  const shareAsImage = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    setGeneratingImage(true);
  };

  const shareBookmarkText = async (bookmark: Bookmark) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Formatar tags
      const tagsText =
        bookmark.tags && bookmark.tags.length > 0
          ? bookmark.tags
              .map((tagId) => {
                const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
                return tag ? tag.label : "";
              })
              .filter(Boolean)
              .join(", ")
          : "";

      // Montar texto formatado
      const text = `📚 *Destaque - Siga o Dinheiro*

📝 *Artigo:* ${bookmark.articleTitle}
📖 *Parte:* ${bookmark.partTitle}

“${bookmark.excerpt}”
${bookmark.note ? `\n💡 *Nota:* ${bookmark.note}` : ""}${tagsText ? `\n🏷️ *Tags:* ${tagsText}` : ""}

———————————————
📱 Compartilhado via app Siga o Dinheiro`;

      await Share.share({
        message: text,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing bookmark text:", error);
    }
  };

  const exportToPDF = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (filteredBookmarks.length === 0) {
        Alert.alert("Nenhum destaque", "Não há destaques para exportar.");
        return;
      }

      Alert.alert(
        "Exportar PDF",
        `Exportar ${filteredBookmarks.length} ${filteredBookmarks.length === 1 ? "destaque" : "destaques"} como PDF?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Exportar",
            onPress: async () => {
              try {
                await exportBookmarksToPDF(filteredBookmarks);
                Alert.alert("Sucesso", "PDF gerado e pronto para compartilhar!");
              } catch (error) {
                console.error("Error exporting PDF:", error);
                Alert.alert("Erro", "Não foi possível gerar o PDF.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in exportToPDF:", error);
      Alert.alert("Erro", "Não foi possível exportar os destaques.");
    }
  };

  const loadArticleComments = async (articleId: string): Promise<ArticleComment[]> => {
    try {
      const stored = await AsyncStorage.getItem("article_comments");
      if (!stored) return [];
      
      const allComments: ArticleComment[] = JSON.parse(stored);
      return allComments.filter((c) => c.articleId === articleId);
    } catch (error) {
      console.error("Error loading comments:", error);
      return [];
    }
  };

  const shareBookmarks = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (filteredBookmarks.length === 0) {
        Alert.alert("Nenhum destaque", "Não há destaques para compartilhar.");
        return;
      }

      // Format bookmarks as text
      let shareText = `📚 Meus Destaques - Siga o Dinheiro\n`;
      shareText += `${filteredBookmarks.length} ${filteredBookmarks.length === 1 ? "destaque" : "destaques"}\n\n`;
      shareText += `═══════════════════════════════\n\n`;

      // Group by article for better organization
      const grouped: Record<string, Bookmark[]> = {};
      filteredBookmarks.forEach((bookmark) => {
        if (!grouped[bookmark.articleId]) {
          grouped[bookmark.articleId] = [];
        }
        grouped[bookmark.articleId].push(bookmark);
      });

      // Carregar comentários de todos os artigos
      const articleCommentsMap: Record<string, ArticleComment[]> = {};
      for (const articleId of Object.keys(grouped)) {
        articleCommentsMap[articleId] = await loadArticleComments(articleId);
      }

      Object.entries(grouped).forEach(([articleId, items], index) => {
        if (index > 0) shareText += `\n───────────────────────────────\n\n`;
        
        shareText += `📄 ${items[0].articleTitle}\n\n`;
        
        items.forEach((bookmark, i) => {
          shareText += `${i + 1}. ${bookmark.partTitle}\n`;
          shareText += `   "${bookmark.excerpt}"\n`;
          
          if (bookmark.note) {
            shareText += `   💭 ${bookmark.note}\n`;
          }
          
          if (bookmark.tags && bookmark.tags.length > 0) {
            const tagLabels = bookmark.tags
              .map((tagId) => PREDEFINED_TAGS.find((t) => t.id === tagId)?.label)
              .filter(Boolean)
              .join(", ");
            shareText += `   🏷️ ${tagLabels}\n`;
          }
          
          shareText += `\n`;
        });
        
        // Adicionar comentários do artigo
        if (articleCommentsMap[articleId] && articleCommentsMap[articleId].length > 0) {
          shareText += `\n💬 Comentários do Artigo (${articleCommentsMap[articleId].length})\n\n`;
          articleCommentsMap[articleId].forEach((comment, i) => {
            shareText += `${i + 1}. "${comment.text}"\n`;
            shareText += `   🗓️ ${new Date(comment.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}\n\n`;
          });
        }
      });

      shareText += `═══════════════════════════════\n`;
      shareText += `Gerado pelo app Siga o Dinheiro\n`;
      shareText += `${new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`;

      const result = await Share.share({
        message: shareText,
        title: "Meus Destaques - Siga o Dinheiro",
      });

      if (result.action === Share.sharedAction) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error sharing bookmarks:", error);
      Alert.alert("Erro", "Não foi possível compartilhar os destaques.");
    }
  };

  // Filtrar por tag, busca e data
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    // Filtro de data
    if (dateFilter !== "all") {
      const bookmarkDate = new Date(bookmark.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === "today") {
        const bookmarkDay = new Date(bookmarkDate.getFullYear(), bookmarkDate.getMonth(), bookmarkDate.getDate());
        if (bookmarkDay.getTime() !== today.getTime()) {
          return false;
        }
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (bookmarkDate < weekAgo) {
          return false;
        }
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (bookmarkDate < monthAgo) {
          return false;
        }
      } else if (dateFilter === "old") {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (bookmarkDate >= thirtyDaysAgo) {
          return false;
        }
      }
    }

    // Filtro de tag
    if (selectedTag && !bookmark.tags?.includes(selectedTag)) {
      return false;
    }

    // Filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesArticle = bookmark.articleTitle.toLowerCase().includes(query);
      const matchesPart = bookmark.partTitle.toLowerCase().includes(query);
      const matchesExcerpt = bookmark.excerpt.toLowerCase().includes(query);
      const matchesNote = bookmark.note?.toLowerCase().includes(query);
      
      if (!matchesArticle && !matchesPart && !matchesExcerpt && !matchesNote) {
        return false;
      }
    }

    return true;
  });

  const groupedBookmarks = () => {
    if (groupBy === "article") {
      const grouped: Record<string, Bookmark[]> = {};
      filteredBookmarks.forEach((bookmark) => {
        if (!grouped[bookmark.articleId]) {
          grouped[bookmark.articleId] = [];
        }
        grouped[bookmark.articleId].push(bookmark);
      });
      return grouped;
    }
    return { all: filteredBookmarks };
  };

  const grouped = groupedBookmarks();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <ThemedText type="title" style={styles.headerTitle}>
              Meus Destaques
            </ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
              {filteredBookmarks.length} {filteredBookmarks.length === 1 ? "destaque" : "destaques"}
              {(selectedTag || searchQuery || dateFilter !== "all") && " encontrado(s)"}
            </ThemedText>
          </View>
          
          {filteredBookmarks.length > 0 && (
            <View style={styles.headerButtons}>
              <Pressable
                onPress={exportToPDF}
                style={[styles.actionButton, { backgroundColor: "#FF9500" }]}
              >
                <IconSymbol name="arrow.down.circle.fill" size={20} color="#fff" />
              </Pressable>
              <Pressable
                onPress={shareBookmarks}
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
              >
                <IconSymbol name="square.and.arrow.up" size={20} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>

        {/* Campo de Busca */}
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar em destaques..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={styles.clearButton}
            >
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
            </Pressable>
          )}
        </View>
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

      {/* Filtros de Data */}
      <View style={[styles.dateFilterContainer, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.dateFilterLabel, { color: colors.icon }]}>Período:</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateFilterContent}
        >
          {[
            { id: "all", label: "Todos" },
            { id: "today", label: "Hoje" },
            { id: "week", label: "Esta Semana" },
            { id: "month", label: "Este Mês" },
            { id: "old", label: "Antigos (30+ dias)", icon: "clock.fill" },
          ].map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => {
                setDateFilter(filter.id as typeof dateFilter);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.dateFilterChip,
                dateFilter === filter.id && { backgroundColor: colors.tint },
              ]}
            >
              {filter.icon && (
                <IconSymbol
                  name={filter.icon as any}
                  size={16}
                  color={dateFilter === filter.id ? "#fff" : colors.icon}
                />
              )}
              <ThemedText
                style={[
                  styles.dateFilterText,
                  dateFilter === filter.id && { color: "#fff" },
                ]}
              >
                {filter.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tagsFilterContainer, { borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tagsFilterContent}
      >
        <Pressable
          onPress={() => {
            setSelectedTag(null);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.tagFilterChip,
            !selectedTag && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.tagFilterText,
              !selectedTag && { color: "#fff" },
            ]}
          >
            Todas
          </ThemedText>
        </Pressable>

        {PREDEFINED_TAGS.map((tag) => {
          const isSelected = selectedTag === tag.id;
          return (
            <Pressable
              key={tag.id}
              onPress={() => {
                setSelectedTag(isSelected ? null : tag.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.tagFilterChip,
                {
                  backgroundColor: isSelected ? tag.color : tag.color + "20",
                  borderColor: tag.color,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagFilterText,
                  { color: isSelected ? "#fff" : tag.color },
                ]}
              >
                {tag.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        ) : filteredBookmarks.length === 0 && (selectedTag || searchQuery) ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name={searchQuery ? "magnifyingglass" : "tag"} size={64} color={colors.icon} />
            <ThemedText style={styles.emptyText}>
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}"`
                : "Nenhum destaque com esta tag"}
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              {searchQuery
                ? "Tente buscar por outros termos"
                : "Tente selecionar outra tag ou limpar o filtro"}
            </ThemedText>
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
                  onPress={() => navigateToArticle(items[0].articleId, items[0].createdAt)}
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
                    onPress={() => navigateToArticle(bookmark.articleId, bookmark.createdAt)}
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

                    {bookmark.tags && bookmark.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {bookmark.tags.map((tagId) => {
                          const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <View
                              key={tagId}
                              style={[styles.tagChip, { backgroundColor: tag.color + "20" }]}
                            >
                              <Text style={[styles.tagText, { color: tag.color }]}>
                                {tag.label}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
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

                  <View style={styles.bookmarkActions}>
                    <Pressable
                      onPress={() => shareBookmarkText(bookmark)}
                      style={styles.actionButton}
                    >
                      <IconSymbol name="square.and.arrow.up" size={20} color="#34C759" />
                    </Pressable>
                    <Pressable
                      onPress={() => shareAsImage(bookmark)}
                      style={styles.actionButton}
                    >
                      <IconSymbol name="photo" size={20} color={colors.tint} />
                    </Pressable>
                    <Pressable
                      onPress={() => deleteBookmark(bookmark.id)}
                      style={styles.actionButton}
                    >
                      <IconSymbol name="trash" size={20} color="#FF3B30" />
                    </Pressable>
                  </View>
                </ThemedView>
              ))}
            </ThemedView>
          ))
        )}
      </ScrollView>

      {/* Gerador de imagem */}
      {generatingImage && selectedBookmark && (
        <QuoteImageGenerator
          bookmark={selectedBookmark}
          onGenerate={() => {}}
          onComplete={() => {
            setGeneratingImage(false);
            setSelectedBookmark(null);
          }}
        />
      )}
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
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
  dateFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  dateFilterLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateFilterContent: {
    flexDirection: "row",
    gap: 8,
  },
  dateFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  dateFilterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tagsFilterContainer: {
    borderBottomWidth: 1,
    maxHeight: 60,
  },
  tagsFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tagFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagFilterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bookmarkActions: {
    flexDirection: "row",
    gap: 8,
  },
});
