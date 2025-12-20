import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSeriesProgress } from "@/hooks/use-series-progress";
import { useFavorites } from "@/hooks/use-favorites";
import { SERIES } from "@/data/series-data";
import { ARTICLES } from "@/data/mock-data";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SeriesDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getProgressPercentage, isSeriesCompleted, getSeriesProgress, getNextArticleId } =
    useSeriesProgress();
  const { isFavorite } = useFavorites();
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  const series = SERIES.find((s) => s.id === id);
  const seriesProgress = getSeriesProgress(id || "");

  if (!series) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Série não encontrada</ThemedText>
      </ThemedView>
    );
  }

  const articles = series.articleIds
    .map((articleId) => ARTICLES.find((a) => a.id === articleId))
    .filter(Boolean);

  const progress = getProgressPercentage(series.id);
  const completed = isSeriesCompleted(series.id);
  const nextArticleId = getNextArticleId(series.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: series.title,
          headerStyle: {
            backgroundColor: tintColor,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={[styles.headerCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedView style={styles.headerTop}>
            <ThemedView style={styles.headerLeft}>
              <IconSymbol name="book.fill" size={24} color={tintColor} />
              <ThemedText type="defaultSemiBold">
                {series.totalParts} {series.totalParts === 1 ? "parte" : "partes"}
              </ThemedText>
            </ThemedView>
            {completed && (
              <ThemedView style={[styles.completedBadge, { backgroundColor: tintColor }]}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
                <ThemedText style={styles.completedText}>Concluída</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          <ThemedText type="title" style={styles.title}>
            {series.title}
          </ThemedText>

          <ThemedText style={styles.description}>{series.description}</ThemedText>

          <ThemedView style={styles.progressContainer}>
            <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
              <ThemedView
                style={[styles.progressFill, { backgroundColor: tintColor, width: `${progress}%` }]}
              />
            </ThemedView>
            <ThemedText style={styles.progressText}>{progress}% completo</ThemedText>
          </ThemedView>

          {nextArticleId && !completed && (
            <Pressable
              onPress={() => router.push(`/article/${nextArticleId}` as any)}
              style={[styles.continueButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.continueButtonText}>
                {seriesProgress ? "Continuar Leitura" : "Começar Série"}
              </ThemedText>
              <IconSymbol name="chevron.right" size={20} color="#fff" />
            </Pressable>
          )}
        </ThemedView>

        <ThemedView style={styles.articlesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Artigos da Série
          </ThemedText>
          {articles.map((article, index) => {
            if (!article) return null;
            const isCompleted = seriesProgress?.completedArticleIds.includes(article.id);
            return (
              <ThemedView key={article.id} style={styles.articleItem}>
                <ThemedView style={styles.articleNumber}>
                  {isCompleted ? (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={tintColor} />
                  ) : (
                    <ThemedView
                      style={[styles.numberCircle, { borderColor, backgroundColor: cardBg }]}
                    >
                      <ThemedText type="defaultSemiBold" style={{ color: tintColor }}>
                        {index + 1}
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
                <ThemedView style={styles.articleCardContainer}>
                  <ArticleCard
                    article={article}
                    onPress={() => router.push(`/article/${article.id}` as any)}
                    isFavorite={isFavorite(article.id)}
                  />
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
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
    paddingTop: 16,
  },
  headerCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  title: {
    marginBottom: 12,
    fontSize: 28,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.8,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  articlesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    lineHeight: 26,
  },
  articleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  articleNumber: {
    marginTop: 8,
    marginRight: 12,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  articleCardContainer: {
    flex: 1,
  },
});
