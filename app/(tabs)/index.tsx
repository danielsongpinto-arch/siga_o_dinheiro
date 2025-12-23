import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useSeriesProgress } from "@/hooks/use-series-progress";
import { useReadingGoals } from "@/hooks/use-reading-goals";
import { getAllBookmarks } from "@/components/article-bookmarks";
import { useDownloadSuggestions } from "@/hooks/use-download-suggestions";
import { useBatchDownload } from "@/hooks/use-batch-download";
import { SeriesCard } from "@/components/series-card";
import { ARTICLES } from "@/data/mock-data";
import { SERIES } from "@/data/series-data";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();
  const { recommendations, getRecommendationReason } = useRecommendations();
  const { getProgressPercentage, isSeriesCompleted } = useSeriesProgress();
  const [refreshing, setRefreshing] = useState(false);
  const [recentBookmarks, setRecentBookmarks] = useState<any[]>([]);
  const { goal } = useReadingGoals();
  const { suggestions, rejectSuggestion } = useDownloadSuggestions();
  const { downloadSeries } = useBatchDownload();

  useEffect(() => {
    loadRecentBookmarks();
  }, []);

  const loadRecentBookmarks = async () => {
    const bookmarks = await getAllBookmarks();
    const sorted = bookmarks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentBookmarks(sorted.slice(0, 3));
  };
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentBookmarks();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const recentArticles = ARTICLES.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 16,
          paddingBottom: Math.max(insets.bottom, 20) + 16,
        },
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Siga o Dinheiro
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Análise de fatos através da perspectiva financeira
        </ThemedText>
      </ThemedView>

      {/* Painel de Resumo Rápido */}
      <ThemedView style={[styles.quickSummaryCard, { backgroundColor: cardBg, borderColor }]}>
        <ThemedView style={styles.quickSummaryHeader}>
          <ThemedText type="subtitle">Seu Progresso</ThemedText>
          <Pressable onPress={() => router.push("/stats" as any)}>
            <IconSymbol name="chart.bar.fill" size={20} color={tintColor} />
          </Pressable>
        </ThemedView>

        {/* Meta de Leitura */}
        {goal && (
          <ThemedView style={styles.goalProgress}>
            <ThemedView style={styles.goalInfo}>
              <ThemedText style={styles.goalLabel}>Meta {goal.type === "weekly" ? "Semanal" : "Mensal"}</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: tintColor }}>
                {goal.current}/{goal.target} artigos
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
              <ThemedView
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: tintColor,
                    width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
        )}

        {/* Últimos Destaques */}
        {recentBookmarks.length > 0 && (
          <ThemedView style={styles.recentBookmarks}>
            <ThemedView style={styles.recentBookmarksHeader}>
              <ThemedText style={styles.recentBookmarksTitle}>Últimos Destaques</ThemedText>
              <Pressable onPress={() => router.push("/bookmarks" as any)}>
                <ThemedText style={[styles.viewAllLink, { color: tintColor }]}>Ver todos</ThemedText>
              </Pressable>
            </ThemedView>
            {recentBookmarks.map((bookmark) => (
              <Pressable
                key={bookmark.id}
                onPress={() => router.push(`/article/${bookmark.articleId}` as any)}
                style={[styles.bookmarkPreview, { borderColor }]}
              >
                <ThemedText numberOfLines={2} style={styles.bookmarkText}>
                  {bookmark.excerpt}
                </ThemedText>
                <ThemedText style={[styles.bookmarkArticle, { color: tintColor }]}>
                  {bookmark.articleTitle}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        )}
      </ThemedView>

      {/* Sugestões de Download */}
      {suggestions.length > 0 && (
        <ThemedView style={[styles.suggestionsCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedView style={styles.suggestionsHeader}>
            <ThemedView style={styles.suggestionsHeaderLeft}>
              <IconSymbol name="lightbulb.fill" size={20} color="#FFD60A" />
              <ThemedText type="defaultSemiBold">Sugestões para Baixar</ThemedText>
            </ThemedView>
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Baixar todos os artigos sugeridos
                for (const suggestion of suggestions) {
                  if (suggestion.article.themeId) {
                    await downloadSeries(suggestion.article.themeId);
                  }
                }
              }}
              style={[styles.downloadAllButton, { backgroundColor: tintColor }]}
            >
              <IconSymbol name="arrow.down.circle.fill" size={16} color="#fff" />
              <ThemedText style={styles.downloadAllText}>Baixar Todos</ThemedText>
            </Pressable>
          </ThemedView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsList}>
            {suggestions.slice(0, 3).map((suggestion) => (
              <Pressable
                key={suggestion.article.id}
                onPress={() => router.push(`/article/${suggestion.article.id}` as any)}
                style={[styles.suggestionItem, { borderColor }]}
              >
                <ThemedView style={styles.suggestionContent}>
                  <ThemedText numberOfLines={2} style={styles.suggestionTitle}>
                    {suggestion.article.title}
                  </ThemedText>
                  <ThemedView style={[styles.suggestionReason, { backgroundColor: borderColor }]}>
                    <ThemedText style={[styles.suggestionReasonText, { color: tintColor }]}>
                      {suggestion.reason}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    rejectSuggestion(suggestion.article.id);
                  }}
                  style={styles.rejectButton}
                >
                  <IconSymbol name="xmark" size={16} color={secondaryText} />
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>
      )}

      <ThemedView style={[styles.introCard, { backgroundColor: cardBg }]}>
        <ThemedText type="subtitle" style={styles.introTitle}>
          Por que analisar fatos pela visão financeira?
        </ThemedText>
        <ThemedText style={styles.introText}>
          O interesse financeiro próprio é capaz de gerar consequências em ações realizadas que nem
          sempre são divulgadas e contadas dessa forma. Cada evento histórico ou atual possui um
          ciclo financeiro com início, meio e fim, e compreender esses ciclos nos ajuda a entender
          as verdadeiras motivações por trás dos acontecimentos.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            S\u00e9ries Tem\u00e1ticas
          </ThemedText>
          <Pressable
            onPress={() => router.push("/series" as any)}
            style={({ pressed }) => [
              styles.viewAllButton,
              { borderColor },
              pressed && styles.viewAllButtonPressed,
            ]}
          >
            <ThemedText style={[styles.viewAllText, { color: tintColor }]}>Ver todas</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={tintColor} />
          </Pressable>
        </ThemedView>
        {SERIES.slice(0, 2).map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            progress={getProgressPercentage(series.id)}
            isCompleted={isSeriesCompleted(series.id)}
            onPress={() => router.push(`/series/${series.id}` as any)}
          />
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Artigos Recentes
        </ThemedText>
        {recentArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isFavorite={isFavorite(article.id)}
            onPress={() => router.push(`/article/${article.id}` as any)}
          />
        ))}
      </ThemedView>

      {recommendations.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recomendado para Voc\u00ea
          </ThemedText>
          {recommendations.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onPress={() => router.push(`/article/${article.id}` as any)}
              isFavorite={isFavorite(article.id)}
              badge={getRecommendationReason(article)}
            />
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.cycleSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          O Ciclo Financeiro
        </ThemedText>
        <ThemedView style={[styles.cycleCard, { backgroundColor: cardBg }]}>
          <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
            Início
          </ThemedText>
          <ThemedText style={styles.cycleDescription}>
            Identificação dos interesses financeiros iniciais e estabelecimento de estruturas que
            permitirão lucros futuros.
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.cycleCard, { backgroundColor: cardBg }]}>
          <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
            Meio
          </ThemedText>
          <ThemedText style={styles.cycleDescription}>
            Período de acumulação de lucros, expansão de operações e consolidação de ganhos
            financeiros.
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.cycleCard, { backgroundColor: cardBg }]}>
          <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
            Fim
          </ThemedText>
          <ThemedText style={styles.cycleDescription}>
            Conclusão do ciclo com distribuição de lucros. Frequentemente, o fim de um ciclo marca
            o início de outro.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  introCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  introTitle: {
    marginBottom: 12,
    fontSize: 18,
    lineHeight: 24,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 22,
    lineHeight: 28,
  },
  cycleSection: {
    marginBottom: 16,
  },
  cycleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cyclePhase: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  cycleDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewAllButtonPressed: {
    opacity: 0.6,
  },
  viewAllText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  quickSummaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  quickSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalProgress: {
    marginBottom: 20,
  },
  goalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    opacity: 0.7,
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
  recentBookmarks: {
    gap: 12,
  },
  recentBookmarksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recentBookmarksTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  bookmarkPreview: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  bookmarkText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bookmarkArticle: {
    fontSize: 12,
    fontWeight: "600",
  },
  suggestionsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  suggestionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  suggestionsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadAllText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  suggestionsList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  suggestionItem: {
    width: 240,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  suggestionContent: {
    flex: 1,
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  suggestionReason: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  suggestionReasonText: {
    fontSize: 11,
    fontWeight: "600",
  },
  rejectButton: {
    padding: 4,
    marginLeft: 8,
  },
});
