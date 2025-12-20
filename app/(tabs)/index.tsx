import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useSeriesProgress } from "@/hooks/use-series-progress";
import { SeriesCard } from "@/components/series-card";
import { ARTICLES } from "@/data/mock-data";
import { SERIES } from "@/data/series-data";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();
  const { recommendations, getRecommendationReason } = useRecommendations();
  const { getProgressPercentage, isSeriesCompleted } = useSeriesProgress();
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
});
