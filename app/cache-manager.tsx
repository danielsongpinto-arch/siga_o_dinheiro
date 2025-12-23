import { View, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOfflineCache, ArticleWithSize } from "@/hooks/use-offline-cache";

type SortMode = "size" | "date" | "title";

export default function CacheManagerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    cardBg: useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background"),
    border: useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text"),
  };

  const {
    cacheIndex,
    getAllCachedArticlesWithSize,
    removeFromCache,
    getCacheSizeFormatted,
    getCacheUsagePercentage,
  } = useOfflineCache();

  const [articles, setArticles] = useState<ArticleWithSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("size");

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    sortArticles();
  }, [sortMode, articles.length]);

  const loadArticles = async () => {
    setLoading(true);
    const cachedArticles = await getAllCachedArticlesWithSize();
    setArticles(cachedArticles);
    setLoading(false);
  };

  const sortArticles = () => {
    const sorted = [...articles].sort((a, b) => {
      switch (sortMode) {
        case "size":
          return b.sizeInBytes - a.sizeInBytes; // Maior primeiro
        case "date":
          return (
            new Date(a.lastAccessedAt).getTime() - new Date(b.lastAccessedAt).getTime()
          ); // Mais antigo primeiro
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setArticles(sorted);
  };

  const handleRemoveArticle = async (articleId: string, title: string, size: string) => {
    Alert.alert(
      "Remover do Cache",
      `Deseja remover "${title}" do cache?\n\nEspaço liberado: ${size}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const success = await removeFromCache(articleId);
            if (success) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await loadArticles();
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const usagePercentage = getCacheUsagePercentage();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.tint} />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Gerenciar Cache
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            {cacheIndex.articleIds.length} artigos • {getCacheSizeFormatted()}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {/* Indicador de Uso */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.usageHeader}>
            <ThemedText type="defaultSemiBold">Espaço Utilizado</ThemedText>
            <ThemedText style={[styles.usagePercentage, { color: colors.tint }]}>
              {usagePercentage.toFixed(0)}%
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: usagePercentage > 80 ? "#FF3B30" : colors.tint,
                  width: `${Math.min(usagePercentage, 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={[styles.usageInfo, { color: colors.icon }]}>
            {cacheIndex.articleIds.length} de 50 artigos • {getCacheSizeFormatted()}
          </ThemedText>
        </View>

        {/* Ordenação */}
        <View style={styles.sortContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sortLabel}>
            Ordenar por:
          </ThemedText>
          <View style={styles.sortButtons}>
            {[
              { mode: "size" as SortMode, label: "Tamanho", icon: "arrow.down.circle" },
              { mode: "date" as SortMode, label: "Data", icon: "clock" },
              { mode: "title" as SortMode, label: "Título", icon: "textformat" },
            ].map((option) => (
              <Pressable
                key={option.mode}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSortMode(option.mode);
                }}
                style={({ pressed }) => [
                  styles.sortButton,
                  {
                    backgroundColor: sortMode === option.mode ? colors.tint : colors.cardBg,
                    borderColor: colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <IconSymbol
                  name={option.icon as any}
                  size={16}
                  color={sortMode === option.mode ? "#fff" : colors.icon}
                />
                <ThemedText
                  style={[
                    styles.sortButtonText,
                    { color: sortMode === option.mode ? "#fff" : colors.text },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Lista de Artigos */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="tray" size={48} color={colors.icon} />
            <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
              Nenhum artigo em cache
            </ThemedText>
          </View>
        ) : (
          <View style={styles.articlesList}>
            {articles.map((article, index) => (
              <View
                key={article.id}
                style={[
                  styles.articleCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  index > 0 && styles.articleCardSpacing,
                ]}
              >
                <View style={styles.articleContent}>
                  <View style={styles.articleHeader}>
                    <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.articleTitle}>
                      {article.title}
                    </ThemedText>
                    <ThemedText style={[styles.articleSize, { color: colors.tint }]}>
                      {article.sizeFormatted}
                    </ThemedText>
                  </View>
                  <View style={styles.articleMeta}>
                    <IconSymbol name="person" size={14} color={colors.icon} />
                    <ThemedText style={[styles.articleMetaText, { color: colors.icon }]}>
                      {article.author}
                    </ThemedText>
                    <ThemedText style={[styles.articleMetaText, { color: colors.icon }]}>•</ThemedText>
                    <IconSymbol name="clock" size={14} color={colors.icon} />
                    <ThemedText style={[styles.articleMetaText, { color: colors.icon }]}>
                      {formatDate(article.lastAccessedAt)}
                    </ThemedText>
                  </View>
                </View>
                <Pressable
                  onPress={() =>
                    handleRemoveArticle(article.id, article.title, article.sizeFormatted)
                  }
                  style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                >
                  <IconSymbol name="trash" size={20} color="#FF3B30" />
                </Pressable>
              </View>
            ))}
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  usagePercentage: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  usageInfo: {
    fontSize: 13,
  },
  sortContainer: {
    marginBottom: 20,
  },
  sortLabel: {
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  articlesList: {
    gap: 12,
  },
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  articleCardSpacing: {
    // marginTop handled by gap in parent
  },
  articleContent: {
    flex: 1,
    marginRight: 12,
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  articleTitle: {
    flex: 1,
    marginRight: 8,
  },
  articleSize: {
    fontSize: 14,
    fontWeight: "600",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  articleMetaText: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
