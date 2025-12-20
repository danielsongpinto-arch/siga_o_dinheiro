import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { useFavorites } from "@/hooks/use-favorites";
import { ARTICLES } from "@/data/mock-data";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");

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
});
